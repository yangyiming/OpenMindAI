import Router from '@koa/router';
import multer from '@koa/multer';
import { DocumentService } from '../service/document.service';
import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Document } from '../entity/document';
import { successResponse, errorResponse, PageRequest } from '../typings/global';
const router = new Router({
  prefix: '/api/documents'
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB
  }
});



const getDocumentRepository = () => getRepository(Document);
const getDocumentService = () => new DocumentService(getDocumentRepository());

router.post('/upload', upload.single('file'), async (ctx: Context) => {
  const file = ctx.file;
  if (!file) {
    ctx.status = 400;
    ctx.body = errorResponse('No file uploaded');
    return;
  }
  const documentService = getDocumentService();
  const document = await documentService.uploadFile(file);
  ctx.body = successResponse(document);
});

router.post('/:id/reupload', upload.single('file'), async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  const file = ctx.file;
  if (!file) {
    ctx.status = 400;
    ctx.body = errorResponse('No file uploaded');
    return;
  }
  const documentService = getDocumentService();
  const document = await documentService.reuploadFile(id, file);
  ctx.body = successResponse(document);
});

router.get('/', async (ctx: Context) => {
  const documentService = getDocumentService();
  const documents = await documentService.getDocuments();
  ctx.body = successResponse(documents);
});

router.get('/search', async (ctx: Context) => {
  const query = ctx.query.q as string;
  const documentService = getDocumentService();
  const documents = await documentService.searchDocuments(query);
  ctx.body = successResponse(documents);
});

/**
 * 获取文档分页数据
 */
router.post('/pages', async (ctx: Context) => {
  const {page} = ctx.request.body as PageRequest;
  const currentPage = parseInt(page.current_page?.toString()) || 1;
  const pageSize = Math.min(page.page_size || 10, 100);
  
  const documentService = getDocumentService();
  const { list, total } = await documentService.getDocumentPages(currentPage, pageSize);
  
  ctx.body = successResponse({
    list,
    page: {
      current_page: currentPage,
      page_size: pageSize,
      total
    }
  });
});

router.get('/:id', async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  const documentService = getDocumentService();
  const document = await documentService.getDocument(id);
  ctx.body = successResponse(document);
});

router.get('/:id/content', async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  const documentService = getDocumentService();
  const content = await documentService.getDocumentContent(id);
  ctx.body = successResponse({ content });
});

router.delete('/:id', async (ctx: Context) => {
  const id = ctx.params.id
  const documentService = getDocumentService();
  await documentService.deleteDocument(id);
  ctx.body = successResponse(null, 'Document deleted successfully');
});

export default router;
