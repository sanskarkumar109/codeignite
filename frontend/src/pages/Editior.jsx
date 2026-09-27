import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import AiChatDrawer from '../components/AiChatDrawer';
import CodeDiffModal from '../components/CodeDiffModal';
import CommandPaletteModal from '../components/CommandPaletteModal';
import FileTreeSidebar from '../components/FileTreeSidebar';
import VisualInspectorPopover from '../components/VisualInspectorPopover';
import VisionUploadModal from '../components/VisionUploadModal';
import TestRunnerTerminal from '../components/TestRunnerTerminal';
import Editor from '@monaco-editor/react';
import { AiOutlineExpandAlt, AiOutlineCompress, AiOutlineReload } from "react-icons/ai";
import { BsMagic, BsCopy, BsCheck2 } from "react-icons/bs";
import { FiTarget, FiTrash2 } from "react-icons/fi";
import { api_base_url, getStoredTheme, applyTheme } from '../helper';
import { useParams } from 'react-router-dom';

const Editior = () => {
  const [tab, setTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  background-color: #ffffff;\n  color: #1e293b;\n}");
  const [jsCode, setJsCode] = useState("// JavaScript Code");
  const [projectTitle, setProjectTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleClearCode = () => {
    if (window.confirm("Are you sure you want to clear all code (HTML, CSS & JS) from the canvas workspace?")) {
      setHtmlCode("");
      setCssCode("");
      setJsCode("");
      setFiles(prev => prev.map(f => ({ ...f, content: "" })));
    }
  };

  // Editor Extra Actions State
  const [isCopied, setIsCopied] = useState(false);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // AI Fix State
  const [iframeError, setIframeError] = useState(null);
  const [isFixingAI, setIsFixingAI] = useState(false);

  // Phase 1 Features State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [proposedBlocks, setProposedBlocks] = useState(null);

  // Phase 2 Features State
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);
  const [files, setFiles] = useState([
    { name: 'index.html', path: '/index.html', content: '<h1>Hello world</h1>', language: 'html' },
    { name: 'styles.css', path: '/styles.css', content: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  background-color: #ffffff;\n  color: #1e293b;\n}', language: 'css' },
    { name: 'script.js', path: '/script.js', content: '// JavaScript Code', language: 'javascript' }
  ]);
  const [activeFilePath, setActiveFilePath] = useState('/index.html');
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [inspectedElement, setInspectedElement] = useState(null);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

  // Automated AI Test Suite Generator State
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

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
      if (event.data && event.data.type === 'INSPECT_ELEMENT') {
        setInspectedElement(event.data.element);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Update active file content when Monaco changes
  const handleEditorChange = (value) => {
    const newContent = value || '';
    if (tab === 'html') setHtmlCode(newContent);
    if (tab === 'css') setCssCode(newContent);
    if (tab === 'js') setJsCode(newContent);

    setFiles(prev => prev.map(f => {
      if (f.path === activeFilePath) {
        return { ...f, content: newContent };
      }
      return f;
    }));
  };

  const handleSelectFile = (file) => {
    setActiveFilePath(file.path);
    if (file.name.endsWith('.css')) setTab('css');
    else if (file.name.endsWith('.js')) setTab('js');
    else setTab('html');
  };

  const handleCreateFile = (newFile) => {
    setFiles(prev => [...prev, newFile]);
    handleSelectFile(newFile);
  };

  const handleDeleteFile = (path) => {
    setFiles(prev => prev.filter(f => f.path !== path));
    if (activeFilePath === path) {
      handleSelectFile(files[0]);
    }
  };

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
        jsCode: jsCode,
        files: files
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

    const inspectorScript = isInspectorActive ? `
      <script>
        (function() {
          let prevHover = null;
          document.addEventListener('mouseover', function(e) {
            e.stopPropagation();
            if (prevHover) prevHover.style.outline = '';
            prevHover = e.target;
            e.target.style.outline = '2px dashed #3B82F6';
          });
          document.addEventListener('mouseout', function(e) {
            if (prevHover) prevHover.style.outline = '';
          });
          document.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.parent.postMessage({
              type: 'INSPECT_ELEMENT',
              element: {
                tagName: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                outerHTML: e.target.outerHTML,
                textContent: e.target.textContent
              }
            }, '*');
          });
        })();
      </script>
    ` : '';

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
      ${inspectorScript}
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
  }, [htmlCode, cssCode, jsCode, isInspectorActive]);

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

          if (data.project.files && data.project.files.length > 0) {
            setFiles(data.project.files);
          } else {
            setFiles([
              { name: 'index.html', path: '/index.html', content: data.project.htmlCode || '', language: 'html' },
              { name: 'styles.css', path: '/styles.css', content: data.project.cssCode || '', language: 'css' },
              { name: 'script.js', path: '/script.js', content: data.project.jsCode || '', language: 'javascript' }
            ]);
          }
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
  }, [projectID, htmlCode, cssCode, jsCode, files]);

  const monacoTheme = activeTheme === "dark" ? "vs-dark" : "vs";

  const handleApplyAiCode = ({ html, css, js }) => {
    if (html !== undefined) setHtmlCode(html);
    if (css !== undefined) setCssCode(css);
    if (js !== undefined) setJsCode(js);

    setFiles(prev => prev.map(f => {
      if (f.path === '/index.html' && html !== undefined) return { ...f, content: html };
      if (f.path === '/styles.css' && css !== undefined) return { ...f, content: css };
      if (f.path === '/script.js' && js !== undefined) return { ...f, content: js };
      return f;
    }));
  };

  const handleOpenDiffModal = (blocks) => {
    setProposedBlocks(blocks);
    setIsDiffModalOpen(true);
  };

  const getActiveCode = () => {
    if (tab === 'html') return htmlCode;
    if (tab === 'css') return cssCode;
    return jsCode;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden transition-colors duration-200 relative">
      <EditiorNavbar
        projectTitle={projectTitle}
        onSave={saveProject}
        isSaving={isSaving}
        onDownload={handleDownload}
        onOpenAiChat={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isAiDrawerOpen={isAiDrawerOpen}
        onToggleFileTree={() => setIsFileTreeOpen(!isFileTreeOpen)}
        isFileTreeOpen={isFileTreeOpen}
        onOpenVisionModal={() => setIsVisionModalOpen(true)}
        onOpenTestRunner={() => setIsTestRunnerOpen(!isTestRunnerOpen)}
        isTestRunnerOpen={isTestRunnerOpen}
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

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        {/* Phase 2: Virtual File System Explorer Sidebar */}
        <FileTreeSidebar
          isOpen={isFileTreeOpen}
          onClose={() => setIsFileTreeOpen(false)}
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
        />

        {/* Editor & Preview Split Container */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden">
          {/* Left Side: Monaco Editor Container */}
          <div className={`flex flex-col min-h-0 border-r border-b md:border-b-0 border-[var(--border)] transition-all duration-300 ${isExpanded ? "w-full h-full" : "w-full md:w-1/2 h-1/2 md:h-full"}`}>
            {/* Editor Language Tabs & Header */}
            <div className="flex items-center justify-between bg-[var(--bg-secondary)] border-b border-[var(--border)] px-3 sm:px-4 h-11 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setTab("html"); setActiveFilePath('/index.html'); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === "html" ? "btn-accent shadow-sm" : "btn-secondary"
                    }`}
                >
                  <span>HTML</span>
                </button>

                <button
                  onClick={() => { setTab("css"); setActiveFilePath('/styles.css'); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === "css" ? "btn-accent shadow-sm" : "btn-secondary"
                    }`}
                >
                  <span>CSS</span>
                </button>

                <button
                  onClick={() => { setTab("js"); setActiveFilePath('/script.js'); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === "js" ? "btn-accent shadow-sm" : "btn-secondary"
                    }`}
                >
                  <span>JS</span>
                </button>
              </div>

              {/* Copy, Clear & Fullscreen Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearCode}
                  className="flex items-center gap-1 btn-secondary text-xs px-2.5 py-1 rounded-lg cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  title="Clear All Code from Canvas"
                  aria-label="Clear All Code from Canvas"
                >
                  <FiTrash2 className="text-xs" />
                  <span className="text-[11px] hidden sm:inline">Clear</span>
                </button>

                <button
                  onClick={copyTabCode}
                  className="flex items-center gap-1 btn-secondary text-xs px-2.5 py-1 rounded-lg cursor-pointer"
                  title="Copy Active Tab Code"
                >
                  {isCopied ? <BsCheck2 className="text-emerald-500 text-sm" /> : <BsCopy className="text-xs" />}
                  <span className="text-[11px] hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="btn-secondary text-sm p-1.5 rounded-lg cursor-pointer"
                  title={isExpanded ? "Collapse Editor" : "Expand Fullscreen"}
                >
                  {isExpanded ? <AiOutlineCompress /> : <AiOutlineExpandAlt />}
                </button>
              </div>
            </div>

            {/* Monaco Code Editor */}
            <div className="flex-1 w-full relative min-h-0">
              <Editor
                onChange={handleEditorChange}
                height="100%"
                theme={monacoTheme}
                language={tab === "js" ? "javascript" : tab}
                value={getActiveCode()}
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
            </div>
          </div>

          {/* Right Side: Output Live Preview Screen */}
          {!isExpanded && (
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[#FFFFFF] flex flex-col min-h-0 overflow-hidden">
              {/* Output Header */}
              <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 h-11 flex items-center justify-between shrink-0 text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                  <span>Live Preview Canvas</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Phase 2: Click-to-Edit Inspector Toggle */}
                  <button
                    onClick={() => setIsInspectorActive(!isInspectorActive)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${isInspectorActive
                        ? 'btn-accent shadow-md animate-pulse'
                        : 'btn-secondary text-[var(--text-secondary)]'
                      }`}
                    title="Toggle Canvas Visual Inspector Mode"
                  >
                    <FiTarget className="text-sm" />
                    <span>{isInspectorActive ? 'Inspect Mode ON' : 'Inspect'}</span>
                  </button>

                  <button
                    onClick={run}
                    className="btn-secondary text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer"
                    title="Refresh Output"
                  >
                    <AiOutlineReload />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Edge-to-Edge Preview Iframe */}
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

      {/* Phase 1 AI Co-Pilot Drawer */}
      <AiChatDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        projectTitle={projectTitle}
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        onApplyCode={handleApplyAiCode}
        onOpenDiffModal={handleOpenDiffModal}
        activeError={iframeError}
      />

      {/* Phase 1 Code Diff Review Modal */}
      <CodeDiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        originalHtml={htmlCode}
        originalCss={cssCode}
        originalJs={jsCode}
        proposedBlocks={proposedBlocks}
        onConfirmApply={handleApplyAiCode}
      />

      {/* Phase 1 Command Palette Modal (Ctrl + K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSave={saveProject}
        onDownload={handleDownload}
        onToggleTheme={() => {
          const nextTheme = activeTheme === "dark" ? "light" : "dark";
          applyTheme(nextTheme);
        }}
        onOpenAiChat={() => setIsAiDrawerOpen(true)}
        onTriggerAiFix={handleAiFix}
        onRefreshPreview={run}
        onSwitchTab={(newTab) => setTab(newTab)}
        onClearCode={handleClearCode}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
        activeTheme={activeTheme}
      />

      {/* Phase 2: Visual Element Inspector Popover */}
      <VisualInspectorPopover
        isOpen={!!inspectedElement}
        onClose={() => setInspectedElement(null)}
        inspectedElement={inspectedElement}
        onSendAiInstruction={(instruction) => {
          setIsAiDrawerOpen(true);
          // Let AI handle inspected instruction via drawer
        }}
      />

      {/* Phase 2: Vision AI Image-to-Code Upload Modal */}
      <VisionUploadModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        projectTitle={projectTitle}
        currentHtml={htmlCode}
        currentCss={cssCode}
        currentJs={jsCode}
        onApplyGeneratedCode={handleApplyAiCode}
      />

      {/* Automated AI Test Suite Generator Terminal Drawer */}
      <TestRunnerTerminal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
        projectTitle={projectTitle}
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        onTriggerAiFix={handleAiFix}
      />
    </div>
  );
};

export default Editior;
