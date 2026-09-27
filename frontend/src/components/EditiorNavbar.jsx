import React, { useEffect, useState } from 'react';
import logo from "../images/logo.png";
import { Link } from 'react-router-dom';
import { FiDownload, FiSave, FiArrowLeft, FiCheckCircle, FiSun, FiMoon, FiSearch, FiFolder, FiImage } from "react-icons/fi";
import { BsMagic } from "react-icons/bs";
import { applyTheme, getStoredTheme } from '../helper';

const EditiorNavbar = ({
  projectTitle,
  onSave,
  isSaving,
  onDownload,
  onOpenAiChat,
  onOpenCommandPalette,
  isAiDrawerOpen,
  onToggleFileTree,
  isFileTreeOpen,
  onOpenVisionModal,
  onOpenTestRunner,
  isTestRunnerOpen
}) => {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail);
    };
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const toggleThemeMode = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="app-panel h-14 px-3 sm:px-5 flex items-center justify-between border-b z-40 shrink-0">
      {/* Left: Back, Explorer Toggle & Project Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="flex items-center gap-1 btn-secondary text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-lg"
          title="Return to Dashboard"
          aria-label="Return to Dashboard"
        >
          <FiArrowLeft className="text-xs" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* File Explorer Toggle Button */}
        <button
          onClick={onToggleFileTree}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            isFileTreeOpen
              ? 'btn-accent shadow-sm'
              : 'btn-secondary'
          }`}
          title="Toggle Multi-File Explorer"
        >
          <FiFolder className="text-xs text-[var(--accent)]" />
          <span className="hidden md:inline">Files</span>
        </button>

        <div className="h-4 w-px bg-[var(--border)] hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <img className="w-5 h-5 sm:w-6 sm:h-6 object-contain" src={logo} alt="CodeIgnite" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs font-semibold truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
              {projectTitle || "Untitled Project"}
            </h1>
            <span className="hidden lg:flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <FiCheckCircle className="text-[10px]" />
              Live Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Command Palette, Vision AI, AI Tests, AI Co-Pilot, Theme, Save & Download) */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-1.5 btn-secondary px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
          title="Open Command Palette (Ctrl + K)"
        >
          <FiSearch className="text-xs text-[var(--accent)]" />
          <span className="text-[11px] font-medium">Commands</span>
          <kbd className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)]">
            Ctrl+K
          </kbd>
        </button>

        {/* Vision AI Image-to-Code Button */}
        <button
          onClick={onOpenVisionModal}
          className="flex items-center gap-1 btn-secondary px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          title="Vision AI: Upload UI Screenshot to Code"
        >
          <FiImage className="text-xs text-amber-400" />
          <span className="hidden md:inline">Vision AI</span>
        </button>

        {/* AI Test Runner Button */}
        <button
          onClick={onOpenTestRunner}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            isTestRunnerOpen
              ? 'btn-accent shadow-sm'
              : 'btn-secondary text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
          title="Open Automated AI Test Runner Terminal"
        >
          <span>🧪</span>
          <span className="hidden md:inline">AI Tests</span>
        </button>

        {/* AI Co-Pilot Drawer Toggle */}
        <button
          onClick={onOpenAiChat}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            isAiDrawerOpen
              ? 'btn-accent shadow-md ring-2 ring-[var(--accent)]/50'
              : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20'
          }`}
          title="Toggle AI Co-Pilot Chat Sidebar"
        >
          <BsMagic className="text-xs animate-pulse" />
          <span className="hidden md:inline">AI Assistant</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleThemeMode}
          className="flex items-center justify-center w-8 h-8 rounded-lg btn-secondary cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <FiSun className="text-xs text-amber-400 animate-subtle-fade" />
          ) : (
            <FiMoon className="text-xs text-slate-700 animate-subtle-fade" />
          )}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-1 btn-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          title="Export Project HTML File"
          aria-label="Export Project HTML File"
        >
          <FiDownload className="text-xs text-[var(--accent)]" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 btn-accent px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50"
          title="Save Changes (Ctrl + S)"
          aria-label="Save Changes"
        >
          <FiSave className="text-xs" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>
    </header>
  );
};

export default EditiorNavbar;