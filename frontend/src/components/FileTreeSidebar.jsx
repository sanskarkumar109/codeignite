import React, { useState } from 'react';
import { FiFolder, FiFile, FiPlus, FiTrash2, FiCode, FiX, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsFiletypeHtml, BsFiletypeCss, BsFiletypeJs } from 'react-icons/bs';

const FileTreeSidebar = ({
  isOpen,
  onClose,
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onDeleteFile
}) => {
  const [newFileName, setNewFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) return <BsFiletypeHtml className="text-orange-500 text-sm" />;
    if (fileName.endsWith('.css')) return <BsFiletypeCss className="text-sky-400 text-sm" />;
    if (fileName.endsWith('.js')) return <BsFiletypeJs className="text-amber-400 text-sm" />;
    return <FiFile className="text-slate-400 text-sm" />;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let path = newFileName.trim();
    if (!path.includes('.')) path += '.html';

    let lang = 'html';
    if (path.endsWith('.css')) lang = 'css';
    if (path.endsWith('.js')) lang = 'javascript';

    onCreateFile({
      name: path,
      path: `/${path}`,
      content: lang === 'html' ? `<div>New ${path} component</div>` : lang === 'css' ? `/* ${path} styles */` : `// ${path} script`,
      language: lang
    });

    setNewFileName('');
    setIsAdding(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-64 md:w-56 lg:w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col h-full shrink-0 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
        {/* File Tree Header */}
        <div className="h-11 px-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
            <FiFolder className="text-[var(--accent)] text-sm" />
            <span>Project Explorer</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="btn-secondary p-1.5 rounded-md text-xs cursor-pointer"
              title="Create New File"
            >
              <FiPlus />
            </button>
            <button
              onClick={onClose}
              className="btn-secondary p-1.5 rounded-md text-xs cursor-pointer"
              title="Close Explorer"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Add New File Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-2 border-b border-[var(--border)] bg-[var(--bg-primary)]">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Filename (e.g. card.html, theme.css)..."
              className="w-full app-input px-2.5 py-1 text-xs rounded-md"
            />
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary px-2 py-0.5 rounded text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent px-2 py-0.5 rounded text-[10px] font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Files List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            <FiChevronDown className="text-xs" />
            <span>Root Files</span>
          </div>

          {files.map((file) => {
            const isActive = activeFilePath === file.path;
            return (
              <div
                key={file.path}
                onClick={() => onSelectFile(file)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${isActive
                    ? 'btn-accent font-semibold shadow-sm'
                    : 'hover:bg-[var(--accent)]/10 text-[var(--text-primary)]'
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </div>

                {/* Prevent deleting main index/styles/script core files */}
                {!['/index.html', '/styles.css', '/script.js'].includes(file.path) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity cursor-pointer"
                    title="Delete File"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

      export default FileTreeSidebar;
