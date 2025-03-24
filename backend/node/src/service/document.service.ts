import { Repository } from 'typeorm';
import { Document } from '../entity/document';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { File } from '@koa/multer';
import { ObjectId } from 'mongodb';

export class DocumentService {
  private readonly uploadPath = path.join(__dirname, '../../uploads');
  private documentRepository: Repository<Document>;

  constructor(documentRepository: Repository<Document>) {
    this.documentRepository = documentRepository;
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<Document> {
    // 验证文件大小
    if (file.size > 1024 * 1024 * 1024) { // 1GB
      throw new Error('File size exceeds 1GB limit');
    }

    // 创建文档记录
    const document = new Document();
    document.name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    document.type = path.extname(file.originalname).slice(1); // 去掉点
    document.size = file.size;
    document.content = file.buffer.toString();
    document.version = 1;

    return this.documentRepository.save(document);
  }

  async reuploadFile(id: number, file: File): Promise<Document> {
    // 获取原文档
    const original = await this.documentRepository.findOne({ where: { id } });
    if (!original) {
      throw new Error('Document not found');
    }

    // 验证文件大小
    if (file.size > 1024 * 1024 * 1024) { // 1GB
      throw new Error('File size exceeds 1GB limit');
    }

    // 生成新文件名
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}_v${original.version + 1}${ext}`;
    const filePath = path.join(this.uploadPath, filename);

    // 保存新文件
    fs.writeFileSync(filePath, file.buffer);

    // 创建新版本记录
    const document = new Document();
    document.name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    document.type = ext.slice(1); // 去掉点
    document.size = file.size;
    document.path = filePath;
    document.version = original.version + 1;

    return this.documentRepository.save(document);
  }

  async parseFileContent(document: Document): Promise<string> {
    const filePath = document.path;
    const buffer = fs.readFileSync(filePath);

    switch (document.type) {
      case 'txt':
        return buffer.toString();
      case 'xlsx':
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        return xlsx.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
      case 'docx':
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      default:
        throw new Error('Unsupported file type');
    }
  }

  async getDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return this.documentRepository
      .createQueryBuilder('document')
      .where('document.name LIKE :query', { query: `%${query}%` })
      .orWhere('document.type LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getDocument(id: number): Promise<Document> {
    return this.documentRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async getDocumentContent(id: number): Promise<string> {
    const document = await this.getDocument(id);
    if (!document) {
      throw new Error('Document not found');
    }
    return this.parseFileContent(document);
  }

  async deleteDocument(id: number): Promise<void> {
    const document = await this.getDocument(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // 删除物理文件
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }
    
    // 删除数据库记录
    await this.documentRepository.delete(id);
  }

  async getDocumentPages(page: number, pageSize: number): Promise<{ list: Document[]; total: number }> {
    const [list, total] = await this.documentRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return { list, total };
  }
}
