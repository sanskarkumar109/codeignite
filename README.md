# 🚀 CodeIgnite – Next-Gen AI Web IDE & Automated Test Suite

![CodeIgnite Logo](frontend/public/logo.png)

**CodeIgnite** is a state-of-the-art, high-performance browser-based Web Development IDE built with **React**, **Vite**, **Monaco Editor**, **Node.js**, **Express**, **MongoDB**, and **Google Gemini 2.5 AI**. It combines a VS Code-style editing experience with real-time HTML/CSS/JS canvas execution, multi-file exploration, **Automated AI Unit & DOM Test Suite Generation**, **Vision AI Image-to-Code Conversion**, **Visual Element Inspection**, and **Streaming AI Pair-Programming Co-Pilot**.

---

## 🌟 2026 Standout Features

### 🧪 1. Automated AI Test Suite Generator
- **One-Click Test Generation**: Dedicated **"🧪 AI Tests"** button in the toolbar and `Ctrl + K` Command Palette.
- **Contextual Assertions**: Automatically inspects your project's HTML, CSS, and JS to write structured unit tests & DOM assertions.
- **In-Browser Terminal Drawer**: Runs assertions live inside an isolated preview iframe, displaying pass/fail badges, duration metrics, and error tracebacks.
- **⚡ AI Auto-Fixer**: One-click **"⚡ Fix Failed Tests with AI"** button automatically repairs broken DOM elements or JS logic.

### 🤖 2. Streaming AI Co-Pilot & Code Diff Review
- **Multi-Turn SSE Streaming**: Interactive right-side chat drawer powered by **Google Gemini 2.5** with Server-Sent Events (SSE).
- **Code Diff Modal**: Review proposed HTML, CSS, and JS side-by-side with diff highlighting before applying code to your live workspace.

### 🎯 3. Visual Element Inspector
- **Click-to-Inspect Mode**: Activate Inspector mode to hover over live preview elements with real-time bounding boxes.
- **DOM Context Capture**: Captures element tag, class names, outerHTML, and text content to send pinpoint target instructions to the AI assistant.

### 📷 4. Vision AI Screenshot-to-Code
- **Mockup to Prototype**: Upload wireframes, UI screenshots, or design mockups.
- **Multimodal Conversion**: Uses Gemini Vision to analyze visual layouts, color palettes, and structural components to write ready-to-run code.

### 📁 5. Virtual Multi-File System Explorer
- **Multi-File Workspace**: Create, switch, and delete custom project files (`index.html`, `styles.css`, `script.js`, plus custom `.html`, `.css`, `.js` modules).
- **Responsive Mobile Drawer**: Slides out as an overlay drawer on mobile viewports while staying pinned on desktop screens.

### ⌨️ 6. VS Code Command Palette (`Ctrl + K`)
- Instant access keyboard palette to run commands, save workspace, switch active themes, trigger AI test runner, format code, and clear canvas.

### 📱 7. Responsive Mobile IDE & Fluid Viewport Switcher
- **1-Tap Mobile View Switcher**: Seamlessly switch between **Code Only**, **Split View**, and **Preview Only** modes on smartphones.
- **Cyber-Dark Theme**: Harmonized translucent glassmorphic palette matching dynamic background artwork with light/dark theme persistence.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core Framework:** React 18 + Vite 5
- **Styling:** TailwindCSS + Custom CSS Glassmorphic Tokens
- **Code Editor:** `@monaco-editor/react` (Monaco Engine with Fira Code ligatures)
- **Icons & UI:** `react-icons`, `react-avatar`, `react-router-dom` v6

### **Backend**
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js password hashing
- **AI Core:** Google GenAI SDK (`@google/genai`) powered by **Gemini 2.5 Flash**

---

## 📁 Repository Structure

```
codeignite/
├── backend/                  # Express REST & SSE API Server
│   ├── routes/
│   │   └── index.js          # AI Generation, Test Suite, Fix & SSE Endpoints
│   ├── models/               # Mongoose Schemas (User & Project Models)
│   ├── app.js                # Express App & Middleware Setup
│   ├── .env.example          # Environment Variables Template
│   └── package.json
│
├── frontend/                 # React Single Page Application (Vite)
│   ├── src/
│   │   ├── components/       # Component Architecture
│   │   │   ├── TestRunnerTerminal.jsx    # Automated Test Execution Drawer
│   │   │   ├── AiChatDrawer.jsx          # Streaming AI Co-Pilot Drawer
│   │   │   ├── CodeDiffModal.jsx         # Visual Code Review Modal
│   │   │   ├── CommandPaletteModal.jsx   # Ctrl + K Command Palette
│   │   │   ├── VisionUploadModal.jsx     # Vision AI Image-to-Code Modal
│   │   │   ├── VisualInspectorPopover.jsx# Live Element Inspector
│   │   │   ├── FileTreeSidebar.jsx       # Multi-File Explorer
│   │   │   ├── EditiorNavbar.jsx         # IDE Action Toolbar
│   │   │   ├── Navbar.jsx                # Main Dashboard Navbar
│   │   │   └── ChangePasswordModal.jsx   # Profile Password Manager
│   │   ├── pages/            # View Pages (Home, Editior, Login, SignUp)
│   │   ├── helper.js         # API Base Config & Reactive Theme Manager
│   │   ├── index.css         # Cyber-Dark Glassmorphic Design System
│   │   └── App.jsx           # Client Router
│   ├── index.html            # Core HTML & FOUC Prevention
│   ├── vite.config.js        # Vite Build Configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Gemini API Key** ([Get free key from Google AI Studio](https://aistudio.google.com/))

---

### 1. Clone & Setup Backend

```bash
git clone https://github.com/sanskarkumar109/codeignite.git
cd codeignite/backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/codeIDE
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:

```bash
npm start
```
*Backend runs at `http://localhost:3000`.*

---

### 2. Setup & Run Frontend

Open a new terminal window:

```bash
cd codeignite/frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` | Open VS Code-style Command Palette |
| `Ctrl + S` | Save current project files to cloud database |
| `Enter` (in AI prompt) | Trigger AI Code Generator |
| `🧪 AI Tests` | Toggle Automated AI Test Suite Terminal |
| `✨ AI Assistant` | Toggle Multi-Turn Streaming AI Co-Pilot |
| `Inspect` | Toggle Visual Element Inspector on Canvas |

---

## ☁️ Free Cloud Deployment Guide

1. **Database**: Create a free **MongoDB Atlas** M0 Cluster.
2. **Backend**: Host `backend/` on **Render** (Set environment variables `MONGODB_URI` and `GEMINI_API_KEY`).
3. **Frontend**: Host `frontend/` on **Vercel** (Set environment variable `VITE_API_BASE_URL` to your Render API URL).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
