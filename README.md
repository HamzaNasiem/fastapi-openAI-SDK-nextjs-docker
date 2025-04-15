# 🤖 AI Agent Chatbot with Web Search Integration

A sophisticated AI chatbot application that combines the power of OpenAI's language models with real-time web search capabilities. Built with a modern tech stack featuring FastAPI, Next.js, and real-time streaming responses.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Key Features

- 🔄 Real-time streaming responses with Server-Sent Events (SSE)
- 🌐 Integrated web search capabilities using Tavily API
- 💬 Persistent chat sessions with context management
- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 High-performance backend with FastAPI
- 🔒 Environment-based configuration
- 🐳 Containerized development and deployment
- 🔍 Smart context handling and conversation memory

## 🛠️ Technology Stack

### Backend Architecture
- **Framework**: FastAPI 0.115.12
- **AI Integration**: OpenAI API with streaming support
- **Web Search**: Tavily API
- **Agent Framework**: OpenAI Agents 0.0.9
- **ASGI Server**: Uvicorn 0.34.0
- **Dependencies**: 
  - chainlit 2.4.400
  - pydantic 2.11.3
  - python-dotenv 1.1.0
  - httpx 0.28.1

### Frontend Architecture
- **Framework**: Next.js 15.3.0
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Real-time Updates**: Server-Sent Events

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
- Docker & Docker Compose
- Node.js 18+
- Python 3.8+
```

### Environment Configuration

1. Backend Configuration (`.env`):
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
MODEL_NAME=gpt-4-turbo-preview
```

2. Frontend Configuration (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Access the applications:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### 💻 Local Development

```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Frontend Setup
cd frontend
npm install
npm run dev
```

## 🔌 API Documentation

### Endpoints

#### POST /agent
Handles chat interactions with streaming responses.

```typescript
// Request Body
interface Query {
  query: string;
  session_id?: string;
}

// Stream Events
interface StreamEvent {
  type: 'session' | 'delta' | 'complete' | 'error';
  content?: string;
  session_id?: string;
  history?: ChatMessage[];
}
```

#### GET /api/health
Health check endpoint returning service status.

## 📁 Project Structure

.
├── backend/
│ ├── src/
│ │ └── open_sdk/
│ │ ├── agents.py # AI agent configuration
│ │ ├── config.py # Backend configuration
│ │ └── tools.py # Web search integration
│ ├── app.py # FastAPI application
│ ├── requirements.txt # Python dependencies
│ └── Dockerfile.dev # Development container
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ │ ├── api/
│ │ │ │ └── chatService.ts # API integration
│ │ │ └── components/
│ │ │ └── Chat.tsx # Main chat component
│ ├── package.json
│ └── Dockerfile.dev
└── docker-compose.yml # Container orchestration


## 🔥 Features in Detail

### Real-time Message Streaming
- Server-Sent Events (SSE) implementation
- Instant response rendering
- Typing indicators
- Smooth scrolling

### Session Management
- Persistent chat sessions
- Context preservation
- History tracking
- Error handling

### UI/UX Features
- Responsive design
- Mobile-friendly interface
- Loading states
- Error feedback
- Auto-scroll
- Input focus management

## 🛡️ Security Considerations

- Environment-based configuration
- API key protection
- CORS configuration
- Rate limiting (TODO)
- Input validation

## 🔧 Advanced Configuration

### Backend Configuration
```python
# Model Configuration
MODEL_NAME = "gpt-4-turbo-preview"  # Can be modified for different OpenAI models

# CORS Settings
ALLOWED_ORIGINS = ["http://localhost:3000"]  # Add production URLs as needed
```

### Frontend Configuration
```typescript
// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```
4. Push to the branch:
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for their powerful language models
- Tavily for web search capabilities
- FastAPI and Next.js communities
- All contributors and users of this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---
Made with ❤️ by [Hamza Naseem/ ziaee.pk@gmail.com]

