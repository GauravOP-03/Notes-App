# 📝 NoteNest – AI-Powered Collaborative Notes App

**NoteNest** is a full-stack, feature-rich notes application that enables users to create, manage, and collaborate on notes with ease. It offers a modern user interface, real-time editing, voice transcription, AI-based summarization, and secure authentication — all built using cutting-edge web technologies.

---

## 🚀 Features

- ✍️ **Rich Text Editing** – Format notes with headers, lists, and other styles.
- 🖼️ **Image Upload** – Upload and view images within notes.
- 🎙️ **Voice Recording & Transcription** – Use Web Speech API to convert speech into text.
- 🤖 **AI Summarization** – Summarize notes instantly with the "Summarize with AI" feature.
- 👥 **Real-Time Collaboration** – Multiple users can edit the same note live.
- 🔒 **Host-Controlled Lock/Unlock** – Only the host can allow or restrict editing access.
- 💬 **In-Note Chat** – Collaborators can chat while editing notes in real time.
- 🔐 **Authentication & Authorization** – Secure login with JWT-based tokens.
- 🔑 **Google OAuth Login** – Sign in easily using your Google account (via Firebase).
- 🔍 **Search & Categorization** – Quickly find and organize notes.
- 🧪 **Zod Validation** – Robust schema validation on both client and server.
- 📦 **Modular Architecture** – Powered by `pnpm` workspaces for scalable development.

---

## 🛠️ Tech Stack

**Frontend**  
- React.js + TypeScript  
- ShadCN UI, Lucide Icons  
- Web Speech API  
- Firebase (Google OAuth)  

**Backend**  
- Node.js, Express.js  
- MongoDB  
- JWT (access + refresh tokens)  
- Zod for validation  
- pnpm workspaces

---

## 📦 Installation

> ⚠️ Requires: Node.js ≥ 18, pnpm ≥ 8, MongoDB running locally or on Atlas

```bash
# Clone the repository
git clone https://github.com/GauravOP-03/Notenest.git
cd Notenest

# Install dependencies across all workspaces
pnpm install

# Set up environment variables
cp .envsample .env
# Open .env and update values for MongoDB URI, Firebase config, JWT secrets, etc.

# Run the entire monorepo (frontend + backend)
pnpm dev

```

---

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Create a new feature branch
git checkout -b feature/my-feature

# Commit and push
git commit -m "Add: my feature"
git push origin feature/my-feature
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🌐 Live Demo

> https://notenest.dpdns.org/ 
> Visit NoteNest

---

## 🙋‍♂️ Author

**Gaurav Kumar**

* GitHub: [@GauravOP-03](https://github.com/GauravOP-03)
* LinkedIn: [Gaurav Kumar](https://linkedin.com/in/gaurav-kumar-5813bb321)

---

Let me know if:

* You want to **add deployment instructions (e.g., Render, Vercel)**.
* You’d like an **API reference section**.
* You need **badges** (build, license, stars, etc.) at the top.
