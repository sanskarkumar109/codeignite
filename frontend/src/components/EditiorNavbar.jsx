import React, { useEffect, useState } from 'react';
import logo from "../images/logo.png";
import { Link } from 'react-router-dom';
import { FiDownload, FiSave, FiArrowLeft, FiCheckCircle, FiSun, FiMoon } from "react-icons/fi";
import { applyTheme, getStoredTheme } from '../helper';

const EditiorNavbar = ({ projectTitle, onSave, isSaving, onDownload }) => {
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
      {/* Left: Back & Project Title */}
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

      {/* Right: Actions (Theme, Save & Download) */}
      <div className="flex items-center gap-2">
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