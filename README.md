🤖 MeenaGPT — Context-Aware AI Assistant with Persistent Memory (Powered by Groq)

MeenaGPT is a production-grade, context-aware AI assistant that delivers personalized conversations with persistent memory. Unlike traditional stateless chatbots, MeenaGPT securely remembers past interactions for each authenticated user and generates intelligent, context-rich responses.

The system is powered by the Groq API for ultra-fast LLM inference and is built with Node.js, MongoDB, and JWT authentication, showcasing real-world AI backend engineering and production deployment practices.

🌟 Key Highlights

✅ Context-aware AI conversations
✅ Persistent per-user memory (MongoDB)
✅ JWT-secured AI access
✅ Ultra-low latency responses using Groq API
✅ Dynamic prompt construction
✅ Production-ready backend architecture
✅ Fully deployed and tested

🧠 What Makes MeenaGPT Different?

Most AI chat systems are stateless — every message is processed independently.

MeenaGPT introduces memory, enabling the assistant to:

Remember user identity (e.g., name, preferences)

Maintain conversational continuity

Answer follow-up questions intelligently

Provide a more human-like, assistant-style experience

Combined with Groq’s high-speed inference, MeenaGPT feels instant and responsive, even with contextual prompts.

🚀 Features
🧠 Persistent Conversation Memory

Securely stores user conversations in MongoDB

Retrieves recent messages to maintain context

Limits memory window for performance and scalability

🔐 Secure Authentication

JWT-based authentication (Bearer tokens)

AI endpoints protected via middleware

Strict per-user isolation of conversation memory

⚡ Context-Aware AI Responses

Builds prompts dynamically from recent conversation history

Maintains conversational flow across multiple messages

Avoids stateless or repetitive responses

🚀 Powered by Groq API

Uses Groq LPU-based inference for extremely fast response times

Supports modern LLMs with low latency

Optimized for real-time AI assistants

🏗️ Production-Ready Backend

Clean controller–middleware architecture

Robust error handling

Proper request validation

Easy extensibility for future AI upgrades

🏗️ System Architecture
User
 ↓
Frontend (JWT Token)
 ↓
/api/assistant/chat
 ↓
verifyToken Middleware
 ↓
Conversation Fetch (MongoDB)
 ↓
Context Prompt Builder
 ↓
Groq API (LLM Inference)
 ↓
Response + Memory Storage
 ↓
AI Reply to User

🧠 Tech Stack
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Groq API (LLM Inference)

Deployment

Backend deployed on Render

Environment-based configuration

📂 Project Structure
meenagpt/
├── controllers/
│   └── assistantController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   └── conversationModel.js
├── routes/
│   └── assistant_routes.js
├── services/
│   └── groqClient.js
├── app.js
└── server.js

⚙️ Getting Started (Local Setup)
1️⃣ Clone the Repository
git clone https://github.com/your-username/meenagpt.git
cd meenagpt

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

4️⃣ Run the Server
npm start

🧪 Tested Scenarios

JWT authentication & verification

AI requests via Thunder Client / Postman

Frontend AI chat integration

Persistent memory across conversations

Error handling (401, 403, 500)

Production debugging on Render

🔮 Use Cases

AI assistants inside SaaS platforms

Meeting copilots (ConferX integration)

Productivity tools

Personalized chat systems

Secure enterprise AI integrations

⚠️ Scalability Notes

Conversation memory is capped to recent messages

Architecture supports rate limiting and request control

Can be extended with:

Vector embeddings

RAG (Retrieval-Augmented Generation)

Session-based or workspace-based memory

👨‍💻 Author

Satyajit Sahoo
Computer Science Student | Full-Stack Developer | AI & Systems Enthusiast

GitHub: https://github.com/Satyajit-69

LinkedIn: https://www.linkedin.com/in/satyajit-sahoo-b16795315/
