# 🚀 CodeIgnite – Next-Gen AI Web IDE

![CodeIgnite Logo](frontend/public/logo.png)

**CodeIgnite** is a modern, high-performance, browser-based Web Development IDE built with **React**, **Vite**, **Monaco Editor**, **Node.js**, **Express**, and **MongoDB**. It combines a VS Code-style editing experience with real-time HTML/CSS/JS rendering and **AI-powered code generation & automated bug fixing**.

---

## ✨ Key Features

- **⚡ Real-Time Live Preview:** Instant output rendering for HTML, CSS, and JavaScript inside a full-viewport, edge-to-edge live iframe canvas.
- **✨ Full-Context AI Code Generator:** Prompt AI to build landing pages, components, or modify existing code without losing project progress (powered by OpenRouter API & GPT-4o-mini).
- **🛠️ AI Bug Fixer:** Automatically traps runtime iframe execution errors and provides one-click AI code resolution.
- **🎨 VS Code-Inspired Theme System:**
  - **VS Code Dark+:** Deep neutral background (`#1E1E1E`), clean surface contrast, and orange/blue accents.
  - **VS Code Light+:** Crisp white background (`#FFFFFF`), high-contrast typography, and accessible borders.
  - **Reactive Theme Toggle:** Smooth Sun/Moon theme switcher with persistence (`localStorage`) and FOUC prevention.
- **📱 Responsive Across All Devices:** Stacks top/bottom on mobile phones and splits 50/50 side-by-side on desktop/laptops.
- **📦 Project Management & Export:**
  - Save project state securely (`Ctrl + S` shortcut supported).
  - Search, filter, and toggle between **Grid** and **List** project views.
  - Export complete projects as single downloadable `.html` files.
- **🔒 Secure Authentication:** JWT token authentication with bcrypt password hashing stored in MongoDB.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 18 + Vite 5
- **Styling:** TailwindCSS + Custom CSS Theme Tokens
- **Code Editor:** `@monaco-editor/react` (Monaco Engine)
- **Icons & UI:** `react-icons`, `react-avatar`, `react-router-dom` v6

### **Backend**
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js
- **AI Integration:** OpenRouter API (`openai/gpt-4o-mini`)

---

## 📁 Repository Structure

```
codeignite/
├── backend/                  # Node.js & Express API Server
│   ├── index.js              # Server Entry Point & REST API Routes
│   ├── models/               # Mongoose Schemas (User & Project Models)
│   ├── .env.example          # Environment Variables Template
│   └── package.json
│
├── frontend/                 # React Single Page Application
│   ├── src/
│   │   ├── components/       # Reusable Components (Navbar, EditiorNavbar, GridCard, ListCard)
│   │   ├── pages/            # Page Views (Home, Login, SignUp, Editior, NoPage)
│   │   ├── helper.js         # API Utilities & Reactive Theme Manager
│   │   ├── index.css         # Theme System Tokens & Component Styling
│   │   └── App.jsx           # Main App & Router
│   ├── index.html            # Entry HTML & FOUC Prevention Script
│   ├── vite.config.js        # Vite Build Configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas connection URI)
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/sanskarkumar109/codeignite.git
cd codeignite
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/codeIDE
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=openai/gpt-4o-mini
   ```

4. Start the backend server:
   ```bash
   npm start
   # or with nodemon
   npm run dev
   ```
   *Backend API will run at `http://localhost:3000`.*

---

### 3. Frontend Setup

1. Open a new terminal tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## ⌨️ Keyboard Shortcuts & Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + S` | Quick Save current HTML, CSS & JS project to cloud |
| `Enter` (in AI prompt bar) | Trigger AI Code Generation |
| `Code / Live Split` | Toggle between Fullscreen Code Editor and Side-by-Side Preview |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repository and submit a pull request.
