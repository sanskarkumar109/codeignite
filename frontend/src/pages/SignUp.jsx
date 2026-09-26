import React, { useState } from 'react';
import logo from "../images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiAtSign, FiArrowRight, FiCode, FiZap } from "react-icons/fi";
import { BsMagic } from "react-icons/bs";
import { api_base_url } from '../helper';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: pwd
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.success === true) {
          navigate("/login");
        } else {
          setError(data.message || "Failed to create account.");
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error("SignUp error:", err);
        setError("Failed to connect to authentication server.");
      });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl app-panel rounded-2xl overflow-hidden border shadow-2xl flex flex-col md:flex-row relative z-10">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6">
              <img className="w-8 h-8 object-contain" src={logo} alt="CodeIgnite Logo" />
              <span className="font-extrabold text-lg">CodeIgnite</span>
            </div>

            <h2 className="text-xl font-bold mb-1">Create an account</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Get started with AI web development in seconds.
            </p>

            <form onSubmit={submitForm} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full app-input pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Username</label>
                <div className="relative">
                  <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full app-input pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full app-input pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
                  <input
                    required
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="••••••••"
                    className="w-full app-input pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--error)] text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg btn-accent font-semibold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                {!isLoading && <FiArrowRight className="text-sm" />}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Visual Panel */}
        <div className="hidden md:flex w-1/2 p-10 flex-col justify-between border-l border-[var(--border)] bg-[var(--bg-elevated)] relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
            <BsMagic /> Cloud Web IDE
          </div>

          <div>
            <h3 className="text-2xl font-extrabold leading-snug mb-3">
              Build Web Projects <span className="text-[var(--accent)]">Faster & Smarter</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Create HTML, CSS & JS projects with AI generation, live error debugging, and cloud persistence.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 app-card p-3 rounded-lg border">
                <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)]">
                  <FiCode className="text-sm" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">Full Context AI Assistant</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Prompt AI to modify or add features to your existing code.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 app-card p-3 rounded-lg border">
                <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)]">
                  <FiZap className="text-sm" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">Real-Time Execution</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Instant output rendering as you write code.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-muted)]">
            © 2026 CodeIgnite. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;