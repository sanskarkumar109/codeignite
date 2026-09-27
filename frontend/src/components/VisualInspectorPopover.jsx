import React, { useState } from 'react';
import { FiTarget, FiX, FiSend, FiCode } from 'react-icons/fi';
import { BsMagic } from 'react-icons/bs';

const VisualInspectorPopover = ({
  isOpen,
  onClose,
  inspectedElement,
  onSendAiInstruction
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen || !inspectedElement) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    const fullPrompt = `Target Element: <${inspectedElement.tagName.toLowerCase()} class="${inspectedElement.className}" id="${inspectedElement.id}">
HTML Snippet: "${inspectedElement.outerHTML.slice(0, 150)}"
Requested Modification: ${instruction.trim()}`;

    onSendAiInstruction(fullPrompt);
    setInstruction('');
    onClose();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
          <FiTarget className="text-base animate-pulse" />
          <span>Visual Element Inspector</span>
        </div>
        <button onClick={onClose} className="btn-secondary p-1 rounded-md text-xs cursor-pointer">
          <FiX />
        </button>
      </div>

      {/* Target Element Info */}
      <div className="mb-3 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-[11px] overflow-hidden">
        <div className="flex items-center gap-1 text-[var(--text-secondary)] font-semibold mb-1">
          <FiCode /> Selected DOM Node:
        </div>
        <div className="text-[var(--text-primary)] font-bold truncate">
          &lt;{inspectedElement.tagName.toLowerCase()}
          {inspectedElement.className ? ` class="${inspectedElement.className}"` : ''}
          {inspectedElement.id ? ` id="${inspectedElement.id}"` : ''}&gt;
        </div>
        <div className="text-[10px] text-[var(--text-muted)] truncate mt-1 italic">
          "{inspectedElement.textContent.trim().slice(0, 60) || 'Element'}"
        </div>
      </div>

      {/* Instruction Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g. Change background to gradient purple, make text bold..."
          className="w-full app-input px-3 py-2 rounded-xl text-xs mb-3"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-3 py-1.5 rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!instruction.trim()}
            className="btn-accent px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <BsMagic /> Prompt AI Fix
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisualInspectorPopover;
