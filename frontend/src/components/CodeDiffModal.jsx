import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { FiX, FiCheck, FiCode } from 'react-icons/fi';
import { getStoredTheme } from '../helper';

const CodeDiffModal = ({
  isOpen,
  onClose,
  originalHtml,
  originalCss,
  originalJs,
  proposedBlocks,
  onConfirmApply
}) => {
  const [activeTab, setActiveTab] = useState('html');
  const activeTheme = getStoredTheme();
  const monacoTheme = activeTheme === 'dark' ? 'vs-dark' : 'vs';

  if (!isOpen || !proposedBlocks) return null;

  // Extract proposed html/css/js from blocks
  let proposedHtml = originalHtml;
  let proposedCss = originalCss;
  let proposedJs = originalJs;

  proposedBlocks.forEach((b) => {
    if (b.lang === 'html') proposedHtml = b.code;
    if (b.lang === 'css') proposedCss = b.code;
    if (b.lang === 'js' || b.lang === 'javascript') proposedJs = b.code;
  });

  const getOriginalForTab = () => {
    if (activeTab === 'html') return originalHtml;
    if (activeTab === 'css') return originalCss;
    return originalJs;
  };

  const getProposedForTab = () => {
    if (activeTab === 'html') return proposedHtml;
    if (activeTab === 'css') return proposedCss;
    return proposedJs;
  };

  const handleApplyAll = () => {
    onConfirmApply({
      html: proposedHtml,
      css: proposedCss,
      js: proposedJs
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="app-panel w-full max-w-5xl h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
            <FiCode className="text-base text-[var(--accent)]" />
            <span>AI Code Diff Review</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Original vs Proposed
            </span>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'html' ? 'btn-accent shadow-sm' : 'btn-secondary'
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'css' ? 'btn-accent shadow-sm' : 'btn-secondary'
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'js' ? 'btn-accent shadow-sm' : 'btn-secondary'
              }`}
            >
              JS
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary p-1.5 rounded-lg text-xs cursor-pointer"
          >
            <FiX className="text-base" />
          </button>
        </div>

        {/* Diff Monaco View */}
        <div className="flex-1 min-h-0 w-full relative">
          <DiffEditor
            height="100%"
            theme={monacoTheme}
            language={activeTab === 'js' ? 'javascript' : activeTab}
            original={getOriginalForTab()}
            modified={getProposedForTab()}
            options={{
              fontSize: 13,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly: true,
              automaticLayout: true,
              renderSideBySide: true
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between shrink-0">
          <span className="text-xs text-[var(--text-secondary)] font-mono">
            Comparing changes for <strong className="text-[var(--text-primary)]">{activeTab.toUpperCase()}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              Reject Changes
            </button>
            <button
              onClick={handleApplyAll}
              className="btn-accent px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <FiCheck className="text-base" /> Apply Proposed Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDiffModal;
