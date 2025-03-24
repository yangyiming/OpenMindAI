# OpenMindAI - RAG Knowledge Base System Framework

OpenMindAI is a knowledge base system framework based on RAG (Retrieval-Augmented Generation) that combines modern web technologies and AI models to provide intelligent Q&A and knowledge management capabilities.

## Technology Stack

### Frontend
- **Framework**: Vue 3
- **UI Framework**: soybean-admin backend management system
- **Build Tool**: Vite

### Backend
- **Node.js**:
  - Web API service
  - User authentication
  - File upload and parsing
  - Data storage
- **Python**:
  - ChromaDB vector database
  - Transformer pre-trained models
  - Contextual conversation management

## Project Structure

```
.
├── backend/                # Backend services
│   ├── node/               # Node.js service
│   └── python/             # Python AI service
└── frontend/               # Frontend application
    ├── public/             # Static resources
    ├── src/                # Source code
    └── packages/           # Local packages
```

## Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/your-repo/OpenMindAI.git
   cd OpenMindAI
   ```

2. Install dependencies
   ```bash
   # Frontend
   cd frontend
   pnpm install

   # Backend (Node.js)
   cd ../backend/node
   yarn install

   # Backend (Python)
   cd ../python
   pip install -r requirements.txt
   ```

3. Start services
   ```bash
   # Start frontend dev server
   cd frontend
   pnpm dev

   # Start Node.js service
   cd backend/node
   yarn start

   # Start Python AI service
   cd backend/python
   python index.py
   ```

## API Documentation

### Node.js API
- `POST /api/auth/login` - User login
- `POST /api/upload` - File upload
- `GET /api/documents` - Get document list

### Python AI API
- `POST /api/chat` - Contextual conversation
- `POST /api/search` - Knowledge base search

## Contributing Guide

We welcome all types of contributions! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)
