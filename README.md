
# 🧠 SpiñO – Spinozist Reflection AI

**SpiñO** is a philosophical AI assistant inspired by Baruch Spinoza's *Ethics*. It guides users through a structured, emotional, and rational process of reflection using a 5-stage transformation model. Built with React, Vite, Firebase, OpenAI, and Firestore.

---

## ✨ Features

- ✅ 5-Stage Spinozist Logic Engine
- ✅ Causal Coaching via GPT-4
- ✅ ΔP (Joy/Clarity) & ΔA (Adequacy) scoring per response
- ✅ Firestore session saving
- ✅ JSON export of sessions
- ✅ Auto-generated session summaries
- ✅ Fully responsive UI with scroll & clean interface

---

## 🧠 5 Stages of Reflection

1. **Affect** – What are you feeling?
2. **Cause** – Why are you feeling it?
3. **Inadequacy** – What do you not fully understand?
4. **Necessity** – What must be as it is?
5. **Clarity** – What insight frees you?

---

## 🛠 Technologies

- React + Vite
- OpenAI GPT-4 API
- Firebase + Firestore
- TypeScript
- Tailwind (basic)

---

## 🔧 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spino-ai.git
cd spino-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

#### `.env` for Backend
```
OPENAI_API_KEY=your-openai-key
```

#### `.env` for Frontend
```
NEXT_FIREBASE_API_KEY=your-key
NEXT_FIREBASE_AUTH_DOMAIN=...
NEXT_FIREBASE_PROJECT_ID=...
NEXT_FIREBASE_STORAGE_BUCKET=...
NEXT_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_FIREBASE_APP_ID=...
```

### 4. Run the App

Backend:
```bash
node server.js
```

Frontend:
```bash
npm run dev
```

---

## 💾 Firebase Integration

Firestore is used to save complete sessions with:
- User ID (static or dynamic)
- Full message history
- Timestamp

All saved sessions can later be extended into dashboard summaries or analytics.

---

## 🧾 Export + Summary

- After 10+ messages, SpiñO generates a **session summary**
- You can also **export full chat history as JSON**

---

## 📤 Deploy

You can deploy SpiñO to:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

Ensure proper backend or switch to API serverless functions for OpenAI calls.

---

## 📜 License

MIT – built for wisdom, reflection, and joy.
