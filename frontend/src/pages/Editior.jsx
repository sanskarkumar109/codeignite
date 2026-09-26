import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { AiOutlineExpandAlt, AiOutlineCompress, AiOutlineReload } from "react-icons/ai";
import { BsMagic, BsCodeSlash, BsPalette, BsPhone, BsLaptop, BsDisplay, BsCopy, BsCheck2 } from "react-icons/bs";
import { FiZap } from "react-icons/fi";
import { api_base_url, getStoredTheme } from '../helper';
import { useParams } from 'react-router-dom';

const Editior = () => {
  const [tab, setTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  background-color: #ffffff;\n  color: #1e293b;\n}");
  const [jsCode, setJsCode] = useState("// JavaScript Code");
  const [projectTitle, setProjectTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Editor Extra Actions State
  const [isCopied, setIsCopied] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop"); // desktop (100%), tablet (768px), mobile (375px)

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // AI Fix State
  const [iframeError, setIframeError] = useState(null);
  const [isFixingAI, setIsFixingAI] = useState(false);

  // Extract projectID from URL using useParams
  const { projectID } = useParams();

  // React state for active theme
  const [activeTheme, setActiveTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handleThemeChange = (e) => {
      setActiveTheme(e.detail);
    };
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && event.data.type === 'IFRAME_ERROR') {
        setIframeError(event.data.message);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const handleAiFix = () => {
    if (!iframeError) return;
    setIsFixingAI(true);
    fetch(api_base_url + "/fixCode", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        htmlCode,
        cssCode,
        jsCode,
        error: iframeError,
        projectTitle
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsFixingAI(false);
        if (data.success) {
          if (data.htmlCode) setHtmlCode(data.htmlCode);
          if (data.cssCode) setCssCode(data.cssCode);
          if (data.jsCode) setJsCode(data.jsCode);
          setIframeError(null);
          alert("⚡ AI successfully fixed the error!");
        } else {
          alert(data.message || "Failed to fix code.");
        }
      })
      .catch(err => {
        setIsFixingAI(false);
        console.error("AI fix error:", err);
        alert("Error connecting to AI fix service.");
      });
  };

  const handleAiGenerate = (customPrompt) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim()) {
      alert("Please enter a prompt for AI to generate code!");
      return;
    }

    setIsGeneratingAI(true);
    fetch(api_base_url + "/generateCode", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: promptToSend,
        projectTitle: projectTitle,
        currentHtml: htmlCode,
        currentCss: cssCode,
        currentJs: jsCode
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsGeneratingAI(false);
        if (data.success) {
          if (data.htmlCode) setHtmlCode(data.htmlCode);
          if (data.cssCode) setCssCode(data.cssCode);
          if (data.jsCode) setJsCode(data.jsCode);
          alert("✨ AI updated code with context awareness!");
        } else {
          alert(data.message || "Failed to generate code.");
        }
      })
      .catch(err => {
        setIsGeneratingAI(false);
        console.error("AI fetch error:", err);
        alert("Error connecting to AI service.");
      });
  };

  const saveProject = () => {
    setIsSaving(true);
    fetch(api_base_url + "/updateProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
        htmlCode: htmlCode,
        cssCode: cssCode,
        jsCode: jsCode
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsSaving(false);
        if (data.success) {
          alert("Project saved successfully!");
        } else {
          alert("Failed to save project.");
        }
      })
      .catch(err => {
        setIsSaving(false);
        console.error("Save error:", err);
        alert("Error saving project.");
      });
  };

  const handleDownload = () => {
    const fullContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectTitle || "CodeIgnite Export"}</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode}

  <script>
${jsCode}
  </script>
</body>
</html>`;

    const blob = new Blob([fullContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(projectTitle || "project").toLowerCase().replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyTabCode = () => {
    const currentText = tab === "html" ? htmlCode : tab === "css" ? cssCode : jsCode;
    navigator.clipboard.writeText(currentText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const run = () => {
    let rawHtml = htmlCode || "";
    const css = cssCode || "";
    const js = jsCode || "";

    const injectedHead = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          min-height: 100vh !important;
          background-color: #ffffff !important;
          color: #000000;
        }
        ${css}
      </style>
      <script>
        window.onerror = function(msg, url, lineNo, columnNo, error) {
          window.parent.postMessage({ type: 'IFRAME_ERROR', message: msg + ' (Line ' + lineNo + ')' }, '*');
          return false;
        };
        console.error = function(...args) {
          window.parent.postMessage({ type: 'IFRAME_ERROR', message: args.join(' ') }, '*');
        };
      </script>
    `;

    let finalDoc = rawHtml;
    if (finalDoc.includes("</head>")) {
      finalDoc = finalDoc.replace("</head>", `${injectedHead}</head>`);
    } else if (finalDoc.includes("<body>")) {
      finalDoc = finalDoc.replace("<body>", `<head>${injectedHead}</head><body>`);
    } else {
      finalDoc = `<!DOCTYPE html><html><head>${injectedHead}</head><body>${finalDoc}</body></html>`;
    }

    const injectedJs = `<script>${js}</script>`;
    if (finalDoc.includes("</body>")) {
      finalDoc = finalDoc.replace("</body>", `${injectedJs}</body>`);
    } else {
      finalDoc += injectedJs;
    }

    const iframe = document.getElementById("iframe");
    if (iframe) {
      iframe.srcdoc = finalDoc;
    }
  };

  useEffect(() => {
    setIframeError(null);
    setTimeout(() => {
      run();
    }, 200);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.project) {
          setHtmlCode(data.project.htmlCode || "");
          setCssCode(data.project.cssCode || "");
          setJsCode(data.project.jsCode || "");
          if (data.project.title) setProjectTitle(data.project.title);
        }
      })
      .catch(err => console.error("Error loading project:", err));
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectID, htmlCode, cssCode, jsCode]);

  const monacoTheme = activeTheme === "dark" ? "vs-dark" : "vs";

  return (
    <div className="h-screen flex flex-col overflow-hidden transition-colors duration-200">
      <EditiorNavbar
        projectTitle={projectTitle}
        onSave={saveProject}
        isSaving={isSaving}
        onDownload={handleDownload}
      />

      {/* AI Code Generation Bar */}
      <div className="app-panel border-b px-4 sm:px-5 py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 z-30 shrink-0">
        <div className="flex items-center gap-2 font-semibold text-xs whitespace-nowrap text-[var(--text-primary)]">
          <BsMagic className="text-sm text-[var(--accent)]" /> AI Assistant:
        </div>

        <div className="flex-1 flex items-center gap-2 w-full">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAiGenerate(); }}
            placeholder="Prompt AI to generate or modify code (e.g. Add responsive navbar, modern cards)..."
            className="w-full app-input px-3.5 py-1.5 rounded-lg text-xs"
          />
          <button
            onClick={() => handleAiGenerate()}
            disabled={isGeneratingAI}
            className="btn-accent font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-sm shrink-0"
          >
            {isGeneratingAI ? "✨ Generating..." : "✨ Generate Code"}
          </button>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden">
        {/* Left Side: Modernized Monaco Editor Container */}
        <div className={`flex flex-col min-h-0 border-r border-b md:border-b-0 border-[var(--border)] transition-all duration-300 ${isExpanded ? "w-full h-full" : "w-full md:w-1/2 h-1/2 md:h-full"}`}>
          {/* Editor Language Tabs & Action Header */}
          <div className="flex items-center justify-between bg-[var(--bg-secondary)] border-b border-[var(--border)] px-3 sm:px-4 h-11 shrink-0">
            {/* Language Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("html")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  tab === "html"
                    ? "btn-accent shadow-sm"
                    : "btn-secondary"
                }`}
              >
                <span>HTML</span>
                <span className="text-[10px] opacity-70">5</span>
              </button>

              <button
                onClick={() => setTab("css")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  tab === "css"
                    ? "btn-accent shadow-sm"
                    : "btn-secondary"
                }`}
              >
                <span>CSS</span>
                <span className="text-[10px] opacity-70">3</span>
              </button>

              <button
                onClick={() => setTab("js")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  tab === "js"
                    ? "btn-accent shadow-sm"
                    : "btn-secondary"
                }`}
              >
                <span>JavaScript</span>
                <span className="text-[10px] opacity-70">ES6</span>
              </button>
            </div>

            {/* Quick Action Helpers (Copy & Fullscreen) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyTabCode}
                className="flex items-center gap-1 btn-secondary text-xs px-2.5 py-1 rounded-lg cursor-pointer"
                title="Copy Active Tab Code"
                aria-label="Copy Active Tab Code"
              >
                {isCopied ? <BsCheck2 className="text-emerald-500 text-sm" /> : <BsCopy className="text-xs" />}
                <span className="text-[11px] hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-secondary text-sm p-1.5 rounded-lg cursor-pointer"
                title={isExpanded ? "Collapse Editor View" : "Expand Fullscreen Editor"}
                aria-label={isExpanded ? "Collapse Editor View" : "Expand Fullscreen Editor"}
              >
                {isExpanded ? <AiOutlineCompress /> : <AiOutlineExpandAlt />}
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 w-full relative min-h-0">
            {tab === "html" ? (
              <Editor
                onChange={(value) => {
                  setHtmlCode(value || "");
                  run();
                }}
                height="100%"
                theme={monacoTheme}
                language="html"
                value={htmlCode}
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  automaticLayout: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  lineNumbersMinChars: 3,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            ) : tab === "css" ? (
              <Editor
                onChange={(value) => {
                  setCssCode(value || "");
                  run();
                }}
                height="100%"
                theme={monacoTheme}
                language="css"
                value={cssCode}
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  automaticLayout: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  lineNumbersMinChars: 3,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            ) : (
              <Editor
                onChange={(value) => {
                  setJsCode(value || "");
                  run();
                }}
                height="100%"
                theme={monacoTheme}
                language="javascript"
                value={jsCode}
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  automaticLayout: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  lineNumbersMinChars: 3,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Seamless Clean White Output Screen */}
        {!isExpanded && (
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[#FFFFFF] flex flex-col min-h-0 overflow-hidden">
            {/* Output Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 h-11 flex items-center justify-between shrink-0 text-[var(--text-primary)]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                <span>Live Preview Output</span>
              </div>

              <button
                onClick={run}
                className="btn-secondary text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer"
                title="Refresh Output"
                aria-label="Refresh Output"
              >
                <AiOutlineReload />
                <span>Refresh</span>
              </button>
            </div>

            {/* Seamless 100% Edge-to-Edge White Canvas */}
            <div className="flex-1 min-h-0 w-full bg-[#FFFFFF] relative overflow-hidden flex flex-col">
              <iframe
                id="iframe"
                className="block w-full h-full min-h-0 bg-[#FFFFFF] border-0 text-black"
                title="CodeIgnite Preview Output"
              />

              {/* Floating Error Banner UI */}
              {iframeError && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#1C1012] border border-[#FF3B30]/50 text-[#FF8080] p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs z-30 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-300">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-lg border border-red-800/60 whitespace-nowrap">
                      ⚠️ Error
                    </span>
                    <span className="truncate font-mono text-slate-200">{iframeError}</span>
                  </div>
                  <button
                    onClick={handleAiFix}
                    disabled={isFixingAI}
                    className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isFixingAI ? "⚡ Fixing..." : "⚡ Fix with AI"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editior;
