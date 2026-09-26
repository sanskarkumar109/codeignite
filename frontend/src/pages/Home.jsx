import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFolder } from "react-icons/fi";
import { BsMagic } from "react-icons/bs";

const Home = () => {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projTitle, setProjTitle] = useState("");
  const [modalError, setModalError] = useState("");
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isGridLayout, setIsGridLayout] = useState(true);

  const navigate = useNavigate();

  const filteredData = data
    ? data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const createProj = (e) => {
    e.preventDefault();
    setModalError("");

    if (!projTitle.trim()) {
      setModalError("Please enter a project title.");
      return;
    }

    setIsCreating(true);
    fetch(api_base_url + "/createProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: projTitle.trim(),
        userId: localStorage.getItem("userId")
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsCreating(false);
        if (data.success) {
          setIsCreateModelShow(false);
          setProjTitle("");
          navigate(`/editior/${data.projectId}`);
        } else {
          setModalError(data.message || "Failed to create project.");
        }
      })
      .catch(err => {
        setIsCreating(false);
        console.error("Create project error:", err);
        setModalError("Network error. Please check backend connection.");
      });
  };

  const getProj = () => {
    fetch(api_base_url + "/getProjects", {
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
          setData(data.projects);
        }
      })
      .catch(err => console.error("Error fetching projects:", err));
  };

  useEffect(() => {
    getProj();
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
          setUserData(data.user);
        }
      })
      .catch(err => console.error("Error fetching user details:", err));
  }, []);

  const handleDeleteSuccess = (deletedId) => {
    setData(prev => prev.filter(p => p._id !== deletedId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 py-8">
        {/* Workspace Banner */}
        <div className="app-panel relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden border shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Workspace</span>
                <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
                Welcome back, <span className="text-[var(--accent)]">{userData ? (userData.name || userData.username) : "Developer"}</span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                Build web prototypes with live HTML/CSS/JS execution and AI code intelligence.
              </p>
            </div>

            <button
              onClick={() => {
                setModalError("");
                setIsCreateModelShow(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg btn-accent font-semibold text-xs shadow-md cursor-pointer shrink-0"
            >
              <FiPlus className="text-base" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-primary)]">
              <FiFolder className="text-[var(--accent)]" />
              <span>Projects</span>
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
              {data ? data.length : 0}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full app-input pl-9 pr-4 py-2 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Project Cards List/Grid */}
        {filteredData.length > 0 ? (
          isGridLayout ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredData.map((item) => (
                <GridCard key={item._id} item={item} onDeleteSuccess={handleDeleteSuccess} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredData.map((item) => (
                <ListCard key={item._id} item={item} onDeleteSuccess={handleDeleteSuccess} />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="app-card rounded-2xl p-12 text-center flex flex-col items-center justify-center border my-8">
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--accent)]">
              <FiFolder className="text-2xl" />
            </div>
            <h3 className="text-base font-bold mb-1 text-[var(--text-primary)]">No Projects Found</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-5">
              {searchQuery ? `No projects match "${searchQuery}".` : "You haven't created any code projects yet."}
            </p>
            <button
              onClick={() => {
                setModalError("");
                setIsCreateModelShow(true);
              }}
              className="btn-accent font-semibold text-xs px-4 py-2 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <FiPlus /> Create Project
            </button>
          </div>
        )}
      </main>

      {/* Modal for Creating a New Project */}
      {isCreateModelShow && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="app-panel w-full max-w-md rounded-xl p-6 border shadow-2xl animate-subtle-fade">
            <div className="flex items-center gap-2 text-xs font-semibold mb-1 text-[var(--accent)]">
              <BsMagic /> New IDE Workspace
            </div>
            <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Create Project</h3>

            <form onSubmit={createProj}>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5 text-[var(--text-secondary)]">Project Title</label>
                <input
                  autoFocus
                  onChange={(e) => {
                    setProjTitle(e.target.value);
                    if (modalError) setModalError("");
                  }}
                  value={projTitle}
                  type="text"
                  placeholder="e.g. Landing Page, Interactive Calculator..."
                  className="w-full app-input px-3 py-2 rounded-lg text-xs"
                />
              </div>

              {modalError && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--error)] text-xs">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModelShow(false);
                    setModalError("");
                  }}
                  className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-lg text-xs font-semibold btn-accent shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
