import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png";
import { FiHome } from "react-icons/fi";

const NoPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="app-panel w-full max-w-md rounded-2xl p-8 border shadow-2xl relative z-10 animate-subtle-fade">
        <img className="w-12 h-12 object-contain mx-auto mb-4" src={logo} alt="CodeIgnite" />
        
        <span className="text-4xl font-extrabold text-[var(--accent)] font-mono tracking-wider">404</span>
        <h1 className="text-xl font-bold mt-2 mb-2">Page Not Found</h1>
        <p className="text-xs text-[var(--text-secondary)] mb-6">
          The page or project route you are trying to access does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg btn-accent font-semibold text-xs shadow-md transition-all cursor-pointer w-full"
        >
          <FiHome className="text-sm" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NoPage;