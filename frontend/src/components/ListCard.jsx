import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiTrash2, FiClock, FiExternalLink } from "react-icons/fi";
import { api_base_url } from '../helper';

const ListCard = ({ item, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProj = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: item._id,
        userId: localStorage.getItem("userId")
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsDeleting(false);
        if (data.success) {
          setIsDeleteModalShow(false);
          if (onDeleteSuccess) onDeleteSuccess(item._id);
          else window.location.reload();
        } else {
          alert(data.message || "Failed to delete project");
          setIsDeleteModalShow(false);
        }
      })
      .catch(err => {
        setIsDeleting(false);
        console.error("Delete error:", err);
      });
  };

  return (
    <>
      <div
        onClick={() => navigate(`/editior/${item._id}`)}
        className="app-card group p-3.5 rounded-xl flex items-center justify-between cursor-pointer border mb-2 shadow-sm"
      >
        <div className="flex items-center gap-3.5 truncate">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shrink-0">
            <FiCode className="text-lg" />
          </div>
          <div className="truncate">
            <h3 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors truncate">
              {item.title || "Untitled Project"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
              <span className="flex items-center gap-1 text-[11px]">
                <FiClock />
                {item.date ? new Date(item.date).toLocaleDateString() : "Recent"}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">HTML/CSS/JS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[var(--accent)] hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
            Open IDE <FiExternalLink className="text-[10px]" />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalShow(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-red-500/10 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
            title="Delete Project"
            aria-label="Delete Project"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalShow && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="app-panel w-full max-w-sm rounded-xl p-6 border shadow-2xl animate-subtle-fade">
            <h3 className="text-base font-bold mb-1.5 text-[var(--text-primary)]">Delete Project</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">"{item.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDeleteModalShow(false)}
                className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteProj}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[var(--error)] hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListCard;