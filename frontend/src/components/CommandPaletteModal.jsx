import React, { useState, useEffect } from 'react';
import { FiSearch, FiSave, FiDownload, FiCode, FiMoon, FiSun, FiLayers, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { BsMagic, BsLightningCharge } from 'react-icons/bs';

const CommandPaletteModal = ({
  isOpen,
  onClose,
  onSave,
  onDownload,
  onToggleTheme,
  onOpenAiChat,
  onTriggerAiFix,
  onRefreshPreview,
  onSwitchTab,
  onClearCode,
  onOpenTestRunner,
  activeTheme
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'ai-chat',
      title: 'Open AI Co-Pilot Assistant',
      category: 'AI Tools',
      icon: <BsMagic className="text-[var(--accent)]" />,
      action: () => {
        onOpenAiChat();
        onClose();
      }
    },
    {
      id: 'ai-tests',
      title: 'Generate & Run Automated AI Test Suite',
      category: 'AI Tools',
      icon: <span className="text-sm">🧪</span>,
      action: () => {
        if (onOpenTestRunner) onOpenTestRunner();
        onClose();
      }
    },
    {
      id: 'ai-fix',
      title: 'Auto-Fix Runtime Error with AI',
      category: 'AI Tools',
      icon: <BsLightningCharge className="text-red-400" />,
      action: () => {
        onTriggerAiFix();
        onClose();
      }
    },
    {
      id: 'clear-code',
      title: 'Clear All Code from Canvas',
      category: 'Editor',
      icon: <FiTrash2 className="text-rose-400" />,
      action: () => {
        if (onClearCode) onClearCode();
        onClose();
      }
    },
    {
      id: 'save',
      title: 'Save Project to Cloud (Ctrl + S)',
      category: 'Project',
      icon: <FiSave className="text-emerald-400" />,
      action: () => {
        onSave();
        onClose();
      }
    },
    {
      id: 'download',
      title: 'Export Project as HTML File',
      category: 'Project',
      icon: <FiDownload className="text-blue-400" />,
      action: () => {
        onDownload();
        onClose();
      }
    },
    {
      id: 'theme',
      title: `Switch Theme (Current: ${activeTheme === 'dark' ? 'VS Code Dark+' : 'VS Code Light+'})`,
      category: 'Appearance',
      icon: activeTheme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-400" />,
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'refresh',
      title: 'Refresh Live Output Canvas',
      category: 'Editor',
      icon: <FiRefreshCw className="text-slate-400" />,
      action: () => {
        onRefreshPreview();
        onClose();
      }
    },
    {
      id: 'tab-html',
      title: 'Switch Editor Tab to HTML',
      category: 'Editor Tabs',
      icon: <FiCode className="text-orange-400" />,
      action: () => {
        onSwitchTab('html');
        onClose();
      }
    },
    {
      id: 'tab-css',
      title: 'Switch Editor Tab to CSS',
      category: 'Editor Tabs',
      icon: <FiCode className="text-sky-400" />,
      action: () => {
        onSwitchTab('css');
        onClose();
      }
    },
    {
      id: 'tab-js',
      title: 'Switch Editor Tab to JavaScript',
      category: 'Editor Tabs',
      icon: <FiCode className="text-amber-300" />,
      action: () => {
        onSwitchTab('js');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="app-panel w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--bg-elevated)]">
          <FiSearch className="text-lg text-[var(--accent)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search actions (Ctrl + K)..."
            className="w-full bg-transparent outline-none text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[var(--accent)]/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-colors">
                    {cmd.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{cmd.title}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{cmd.category}</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
