🤖 MeenaGPT — Context-Aware AI Assistant with Persistent Memory

Live Demo 
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/00cdd542-c00c-4ede-ad76-c50e27da8086" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7c75a04b-ed0a-44e7-9c32-fdd15e9d3d1a" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/b1eb99f1-c1d3-48a9-87b2-8641f193d982" />


MeenaGPT is a context-aware AI assistant that holds personalized conversations with persistent, per-user memory. Unlike stateless chatbots, it stores each authenticated user's past interactions and uses them to generate context-rich replies.

It uses the OpenAI API for LLM inference and is built with Node.js, Express, MongoDB, and JWT authentication.

Live demo: https://meena-gpt.vercel.app/

🌟 Key Highlights
Context-aware AI conversations
Persistent per-user memory (MongoDB)
JWT-secured AI endpoints with strict per-user data isolation
LLM responses powered by the OpenAI API
Dynamic prompt construction from recent history
Clean controller–middleware backend architecture
Deployed on Render with GitHub Actions CI/CD
🧠 What Makes MeenaGPT Different?

Most AI chat systems are stateless: every message is processed independently. MeenaGPT adds memory, so the assistant can:

Remember user details such as name and preferences
Maintain conversational continuity across messages and sessions
Answer follow-up questions correctly
Feel closer to a real assistant
🚀 Features
🧠 Persistent Conversation Memory
Stores user conversations in MongoDB
Retrieves recent messages to rebuild context
Caps the memory window for performance and scalability
🔐 Secure Authentication
JWT-based authentication (Bearer tokens)
AI endpoints protected by middleware
Conversation memory is isolated per user
⚡ Context-Aware Responses
Builds prompts dynamically from recent conversation history
Keeps the flow across multiple messages
Avoids repetitive, stateless answers
🚀 Powered by OpenAI
LLM responses generated through the OpenAI API
Prompt built from recent conversation history for context-aware replies
🏗️ Production-Ready Backend
Controller–middleware architecture
Request validation and structured error handling
Easy to extend with new models or memory strategies
🏗️ System Architecture
User
 ↓
Frontend (React, JWT token)
 ↓
POST /api/assistant/chat
 ↓
verifyToken middleware
 ↓
Fetch recent conversation (MongoDB)
 ↓
Context prompt builder
 ↓
OpenAI API (LLM inference)
 ↓
Save reply to memory
 ↓
AI reply to user
🧰 Tech Stack
Layer	Technology
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Auth	JWT (Bearer tokens)
LLM	OpenAI API
Frontend	React.js
Deployment	Render (backend), Vercel (frontend)
CI/CD	GitHub Actions
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
│   └── openaiClient.js
├── app.js
└── server.js
📡 API
POST /api/assistant/chat

Sends a message and returns the AI reply. Requires a valid JWT.

Headers

Authorization: Bearer <your_jwt_token>
Content-Type: application/json

Request body (field names may differ in your controller; adjust to match)

json
{
  "message": "Hi, my name is Satyajit."
}

Error responses

Status	Meaning
401	Missing or invalid token
403	Token not authorized
500	Server or LLM error
⚙️ Getting Started (Local Setup)
1. Clone the repository
bash
git clone https://github.com/Satyajit-69/meenagpt.git
cd meenagpt
2. Install dependencies
bash
npm install
3. Configure environment variables

Create a .env file:

env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
4. Run the server
bash
npm start
🧪 Tested Scenarios
JWT authentication and verification
AI requests via Postman / Thunder Client
Frontend chat integration
Persistent memory across conversations
Error handling (401, 403, 500)
Production debugging on Render
🔮 Use Cases
AI assistants inside SaaS platforms
Meeting copilots (ConferX integration)
Productivity tools
Personalized chat systems
📈 Scalability Notes
Conversation memory is capped to the most recent messages
The architecture supports rate limiting and request control
Can be extended with:
Vector embeddings and RAG (Retrieval-Augmented Generation)
Session-based or workspace-based memory
Conversation summarization for longer histories
👨‍💻 Author

Satyajit Sahoo Computer Science Student | Full-Stack Developer | AI & Backend Enthusiast

GitHub: https://github.com/Satyajit-69
LinkedIn: https://www.linkedin.com/in/satyajit-sahoo-b16795315/
