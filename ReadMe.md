# 🤖 RAG Chat Application

A modern full-stack Retrieval-Augmented Generation (RAG) chat application built with React and Node.js. Upload PDF documents and chat with their content using Google's Gemini AI.

![RAG Chat Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

- 📄 **PDF Upload & Processing**: Extract and chunk text from PDF documents
- 💬 **Intelligent Chat**: Ask questions about your PDF content
- 🧠 **RAG Technology**: Combines retrieval and generation for accurate responses
- 🎨 **Modern UI**: Beautiful dark theme with responsive design
- 🔒 **Session Isolation**: Each upload creates an isolated chat session
- 🚀 **Production Ready**: Docker support and cloud deployment options

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ 
- Google AI API key ([Get here](https://makersuite.google.com/app/apikey))
- Pinecone account ([Sign up](https://www.pinecone.io/))

### 1-Minute Setup
```bash
# Clone the repository
git clone https://github.com/shivammourya10/RAG-using-.js.git
cd Simple_RAG_in_js

# Quick setup script
./setup.sh
```

### Manual Setup
```bash
# Install dependencies
npm run install-all

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development servers
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │◄──►│   Express API   │◄──►│   Pinecone DB   │
│   (Frontend)    │    │   (Backend)     │    │   (Vectors)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   Port: 5173              Port: 3001              Cloud Database
```

### Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Multer
- **AI**: Google Gemini, LangChain
- **Vector DB**: Pinecone
- **Deployment**: Docker, Render, Vercel

## 📋 Project Structure

```
Simple_RAG_in_js/
├── 📱 frontend/              # React Web Application
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── services/        # API Service
│   │   └── App.jsx         # Main React app
│   └── package.json        # Frontend dependencies
│
├── 🖥️ backend/               # Express API Server  
│   ├── services/
│   │   ├── indexing.js     # PDF processing & embedding
│   │   ├── querying.js     # RAG query handling
│   │   └── session.js      # Session management
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
│
├── 📚 docs/                  # Documentation
│   ├── DEPLOYMENT.md        # Deployment guides
│   ├── RENDER_DEPLOY.md     # Render-specific guide
│   └── PRODUCTION_CHECKLIST.md  # Production setup
│
├── 🐳 Docker files          # Containerization
└── 🔧 Config files         # Environment setup
```

## 🚀 Deployment Options

### 🎯 Render (Recommended)
```bash
# See docs/RENDER_DEPLOY.md for complete guide
npm run deploy:render
```

### 🐳 Docker
```bash
# Start with Docker Compose
npm run docker:up

# View at http://localhost:3000
```

### ☁️ Cloud Platforms
- **Vercel**: Frontend deployment
- **Railway**: Full-stack deployment  
- **Heroku**: Traditional cloud hosting
- **AWS/DigitalOcean**: VPS deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## 🔧 Development

### Available Scripts
```bash
npm run dev              # Start both frontend & backend
npm run install-all      # Install all dependencies
npm run build           # Build for production
npm run docker:up       # Start with Docker
npm run docker:logs     # View Docker logs
```

### Environment Variables
```env
# Required
GOOGLE_API_KEY=your_google_ai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
PINECONE_ENVIRONMENT=us-east-1

# Optional
CHUNK_SIZE=2000
CHUNK_OVERLAP=400
```

## 📊 How It Works

1. **📄 Upload**: User uploads a PDF file
2. **🔄 Process**: Backend extracts and chunks the text
3. **🧮 Embed**: Text chunks are converted to vectors using Google AI
4. **💾 Store**: Vectors are stored in Pinecone database
5. **❓ Query**: User asks a question about the document
6. **🔍 Retrieve**: Relevant chunks are found using similarity search
7. **🤖 Generate**: Google Gemini generates an answer using retrieved context

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload and process PDF |
| `POST` | `/api/query` | Send chat message |
| `POST` | `/api/reset` | Reset chat session |
| `GET`  | `/api/health` | Health check |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for Gemini API
- [Pinecone](https://www.pinecone.io/) for vector database
- [LangChain](https://js.langchain.com/) for RAG framework
- [React](https://react.dev/) for the frontend framework

## 📞 Support

- 📚 Check `docs/DEPLOYMENT.md` for deployment help
- ✅ Use `docs/PRODUCTION_CHECKLIST.md` for production setup
- 🚀 See `docs/RENDER_DEPLOY.md` for Render deployment
- 🐛 Create an issue for bug reports
- 💡 Submit feature requests via issues

---

**Built with ❤️ by [Shivam Mourya](https://github.com/shivammourya10)**

⭐ Star this repo if you found it helpful!
