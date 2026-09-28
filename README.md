# Abhishek Gautam - AI-Powered Portfolio

Full Stack Developer portfolio featuring an interactive AI Representative (powered by NVIDIA NIM / Meta LLaMA 3.2 + RAG), real-time visitor geolocation intelligence, MongoDB persistence, and an Admin Intelligence Console.

## 🚀 Features

- **Modern Glassmorphic Dark UI**: High-aesthetic cyberpunk design with glowing neon gradients, particle effects, and Framer Motion micro-interactions.
- **AI Portfolio Representative**: Context-aware RAG pipeline answering recruiter and visitor questions.
- **Admin Intelligence Console (`/admin`)**:
  - Secure Admin authentication (JWT + bcrypt).
  - Complete visitor query and chat history logs.
  - Visitor geolocation tracking (Country, City, Region, IP Address).
  - Device intelligence (OS, Browser, Device Type, Screen resolution).
  - Search queries and visitor details.
  - Export chat transcripts as JSON.
  - Delete / clear conversations.
- **MongoDB Persistence**:
  - Chat conversations and visitor metadata saved directly into MongoDB.
  - Automatic fallback mode for local development.

---

## 🛠️ Environment Variables

Configure the following in your `.env` file:

```env
# NVIDIA AI API (Free tier from https://build.nvidia.com)
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
MONGODB_DB=portfolio

# JWT Secret for Admin Session
JWT_SECRET=your-super-secret-jwt-key

# Initial Admin Credentials
ADMIN_EMAIL=admin@abhishek.dev
ADMIN_USERNAME=abhishek
ADMIN_PASSWORD=Admin@123456
```

---

## 🔐 Admin Portal

- **URL**: Navigate to `/admin` or `/admin/login`
- **Default Email**: `admin@abhishek.dev`
- **Default Password**: `Admin@123456`
- **Dashboard**: Automatically opens `/admin/dashboard` upon login.

---

## 💻 Development & Deployment

### Run Locally:
```bash
npm install
npm run dev
```

### Build for Production:
```bash
npm run build
```
Deployable seamlessly to **Vercel** with serverless functions support in `/api`.
