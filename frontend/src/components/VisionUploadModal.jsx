import React, { useState } from 'react';
import { FiUploadCloud, FiX, FiImage, FiCheck } from 'react-icons/fi';
import { BsMagic } from 'react-icons/bs';
import { api_base_url } from '../helper';

const VisionUploadModal = ({
  isOpen,
  onClose,
  projectTitle,
  currentHtml,
  currentCss,
  currentJs,
  onApplyGeneratedCode
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImageBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64 || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${api_base_url}/multimodalAi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          prompt: prompt || 'Convert this UI screenshot into pixel-perfect responsive HTML and CSS code.',
          projectTitle,
          currentHtml,
          currentCss,
          currentJs
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        onApplyGeneratedCode({
          html: data.htmlCode,
          css: data.cssCode,
          js: data.jsCode
        });
        onClose();
        alert('✨ Vision AI successfully converted screenshot to code!');
      } else {
        alert(data.message || 'Failed to process image with Vision AI.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Vision AI upload error:', err);
      alert('Error connecting to Vision AI service.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="app-panel w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
            <BsMagic className="text-base text-[var(--accent)]" />
            <span>Image-to-Code Vision AI</span>
          </div>
          <button onClick={onClose} className="btn-secondary p-1.5 rounded-lg text-xs cursor-pointer">
            <FiX className="text-base" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* File Upload Box */}
          <div className="relative border-2 border-dashed border-[var(--border)] rounded-2xl p-6 text-center hover:border-[var(--accent)] transition-colors cursor-pointer bg-[var(--bg-primary)]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-2">
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl object-contain shadow-md" />
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <FiCheck /> Image Loaded Ready for Vision AI
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <FiUploadCloud className="text-2xl" />
                </div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Click or Drag & Drop UI Screenshot / Mockup
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">PNG, JPG, WebP supported</div>
              </div>
            )}
          </div>

          {/* Optional Prompt Input */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Instructions (Optional):
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Convert layout using responsive CSS flexbox and clean dark mode theme..."
              className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageBase64 || isLoading}
              className="btn-accent px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? '✨ Converting Image to Code...' : '✨ Generate Code from Screenshot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisionUploadModal;
