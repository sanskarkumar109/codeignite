import React, { useEffect, useState } from 'react';
import logo from "../images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { BsGridFill, BsListTask } from "react-icons/bs";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { api_base_url, applyTheme, getStoredTheme } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail);
    };
    window.addEventListener('themeChange', handleThemeChange);

    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setData(data.user);
        }
      })
      .catch(err => console.error("Error fetching user details:", err));

    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const toggleThemeMode = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="app-panel sticky top-0 z-50 px-4 sm:px-6 md:px-10 h-14 flex items-center justify-between border-b shadow-sm">
      {/* Brand Logo & Name */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <img className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105" src={logo} alt="CodeIgnite" />
        <div className="flex items-center gap-2">
          <span className="font-bold text-base tracking-tight">
            CodeIgnite
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-blue-500/30 text-blue-500 dark:text-blue-400 bg-blue-500/10">
            IDE
          </span>
        </div>
      </Link>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleThemeMode}
          className="flex items-center justify-center w-8 h-8 rounded-lg btn-secondary transition-all cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <FiSun className="text-sm text-amber-400 animate-subtle-fade" />
          ) : (
            <FiMoon className="text-sm text-slate-700 animate-subtle-fade" />
          )}
        </button>

        {/* Layout Toggle */}
        <button
          onClick={() => setIsGridLayout(!isGridLayout)}
          className="flex items-center gap-1.5 btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          title="Toggle Grid / List View"
        >
          {isGridLayout ? (
            <>
              <BsListTask className="text-sm" />
              <span className="hidden sm:inline">List View</span>
            </>
          ) : (
            <>
              <BsGridFill className="text-sm" />
              <span className="hidden sm:inline">Grid View</span>
            </>
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full btn-secondary cursor-pointer"
          >
            <Avatar name={data ? (data.name || data.username) : "User"} size="26" round="50%" className="shadow-sm" />
            <span className="text-xs font-medium hidden md:inline truncate max-w-[120px]">
              {data ? (data.name || data.username) : "Account"}
            </span>
          </button>

          {/* User Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 app-panel rounded-xl p-2 shadow-xl border z-50 animate-subtle-fade">
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <p className="text-xs font-semibold truncate">{data ? (data.name || data.username) : "User"}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{data ? data.email : ""}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <FiLogOut className="text-sm" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;