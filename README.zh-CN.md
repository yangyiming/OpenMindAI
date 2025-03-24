# OpenMindAI - RAG 知识库系统框架

OpenMindAI 是一个基于 RAG (Retrieval-Augmented Generation) 的知识库系统框架，结合了现代 Web 技术和人工智能模型，为用户提供智能问答和知识管理功能。

## 技术栈

### 前端
- **框架**: Vue 3
- **UI 框架**: soybean-admin 后台管理系统
- **构建工具**: Vite

### 后端
- **Node.js**: 
  - Web API 服务
  - 用户权限管理
  - 文件上传与解析
  - 数据入库
- **Python**:
  - ChromaDB 向量数据库
  - Transformer 预训练模型
  - 上下文对话管理

## 项目结构

```
.
├── backend/                # 后端服务
│   ├── node/               # Node.js 服务
│   └── python/             # Python AI 服务
└── frontend/               # 前端应用
    ├── public/             # 静态资源
    ├── src/                # 源代码
    └── packages/           # 本地包
```

## 快速开始

1. 克隆仓库
   ```bash
   git clone https://github.com/your-repo/OpenMindAI.git
   cd OpenMindAI
   ```

2. 安装依赖
   ```bash
   # 前端
   cd frontend
   pnpm install

   # 后端 (Node.js)
   cd ../backend/node
   yarn install

   # 后端 (Python)
   cd ../python
   pip install -r requirements.txt
   ```

3. 启动服务
   ```bash
   # 启动前端开发服务器
   cd frontend
   pnpm dev

   # 启动 Node.js 服务
   cd backend/node
   yarn start

   # 启动 Python AI 服务
   cd backend/python
   python index.py
   ```

## API 文档

### Node.js API
- `POST /api/auth/login` - 用户登录
- `POST /api/upload` - 文件上传
- `GET /api/documents` - 获取文档列表

### Python AI API
- `POST /api/chat` - 上下文对话
- `POST /api/search` - 知识库检索

## 贡献指南

我们欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
