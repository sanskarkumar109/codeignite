import React, { useState, useRef, useEffect } from 'react';
import { BsMagic, BsSend, BsTrash, BsCheck2, BsLightningCharge, BsStars } from 'react-icons/bs';
import { FiX, FiCode, FiLayers } from 'react-icons/fi';
import { api_base_url } from '../helper';

const AiChatDrawer = ({
  isOpen,
  onClose,
  projectTitle,
  htmlCode,
  cssCode,
  jsCode,
  onApplyCode,
  onOpenDiffModal,
  activeError
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am your **CodeIgnite AI Co-Pilot**. Ask me to build components, fix bugs, optimize styling, or add interactive features to your project!'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamText, setCurrentStreamText] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamText]);

  const handleSend = async (customText) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage = { id: Date.now(), role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputPrompt('');

    setIsStreaming(true);
    setCurrentStreamText('');

    try {
      const response = await fetch(`${api_base_url}/streamAi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          prompt: textToSend,
          projectTitle,
          currentHtml: htmlCode,
          currentCss: cssCode,
          currentJs: jsCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: `⚠️ **Error**: ${errorData.message || 'Failed to stream response.'}`
          }
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                accumulatedText += `\n\n⚠️ ${parsed.error}`;
              } else if (parsed.token) {
                accumulatedText += parsed.token;
                setCurrentStreamText(accumulatedText);
              }
            } catch (e) {
              // Ignore non-json frames
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, role: 'assistant', content: accumulatedText }
      ]);
      setCurrentStreamText('');
    } catch (err) {
      console.error('SSE Stream error:', err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 3, role: 'assistant', content: '⚠️ Network error while connecting to AI Co-Pilot service.' }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const parseCodeBlocks = (text) => {
    const blocks = [];
    const regex = /```(html|css|javascript|js)?\n([\s\S]*?)```/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const lang = (match[1] || 'html').toLowerCase();
      const code = match[2].trim();
      blocks.push({ lang, code });
    }
    return blocks;
  };

  const handleApplyBlocks = (blocks) => {
    let newHtml = htmlCode;
    let newCss = cssCode;
    let newJs = jsCode;

    blocks.forEach((b) => {
      if (b.lang === 'html') newHtml = b.code;
      else if (b.lang === 'css') newCss = b.code;
      else if (b.lang === 'js' || b.lang === 'javascript') newJs = b.code;
    });

    onApplyCode({ html: newHtml, css: newCss, js: newJs });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] md:w-[460px] bg-[var(--bg-secondary)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            <BsMagic className="text-base" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>AI Co-Pilot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Live SSE
              </span>
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Multi-turn streaming assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="btn-secondary p-2 rounded-lg text-xs cursor-pointer"
            title="Clear Chat History"
          >
            <BsTrash />
          </button>
          <button
            onClick={onClose}
            className="btn-secondary p-2 rounded-lg text-xs cursor-pointer"
            title="Close Assistant"
          >
            <FiX className="text-base" />
          </button>
        </div>
      </div>

      {/* Active Error Quick Notice */}
      {activeError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between gap-2 text-xs text-red-400">
          <span className="truncate font-mono">⚠️ Error: {activeError}</span>
          <button
            onClick={() => handleSend(`Fix this runtime error: ${activeError}`)}
            className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap"
          >
            ⚡ Fix Error
          </button>
        </div>
      )}

      {/* Quick Action Chips */}
      <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-primary)]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => handleSend('Add a modern responsive navigation bar with logo and CTA button.')}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full btn-secondary whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <BsStars className="text-[var(--accent)]" /> Add Navbar
        </button>
        <button
          onClick={() => handleSend('Add dark mode styling and a smooth toggle interaction.')}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full btn-secondary whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <BsLightningCharge className="text-amber-400" /> Add Dark Mode
        </button>
        <button
          onClick={() => handleSend('Make the current layout fully responsive across mobile, tablet, and desktop.')}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full btn-secondary whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <FiLayers className="text-indigo-400" /> Make Responsive
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 text-xs text-[var(--text-primary)]">
        {messages.map((msg) => {
          const blocks = parseCodeBlocks(msg.content);
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'btn-accent text-white rounded-tr-none'
                    : 'app-panel border rounded-tl-none leading-relaxed'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Detected Code Blocks Action Panel */}
                {blocks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">
                      Generated ({blocks.map((b) => b.lang).join(', ')})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenDiffModal(blocks)}
                        className="px-2.5 py-1 rounded-lg btn-secondary text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FiCode /> Diff View
                      </button>
                      <button
                        onClick={() => handleApplyBlocks(blocks)}
                        className="px-2.5 py-1 rounded-lg btn-accent text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <BsCheck2 className="text-sm" /> Apply Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Streaming Token Box */}
        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="max-w-[90%] p-3.5 rounded-2xl app-panel border rounded-tl-none leading-relaxed">
              <div className="flex items-center gap-2 mb-2 text-[var(--accent)] font-semibold text-[11px]">
                <BsMagic className="animate-spin text-sm" /> AI is writing code...
              </div>
              <div className="whitespace-pre-wrap font-sans">{currentStreamText || '...'}</div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Prompt Box */}
      <div className="p-3.5 border-t border-[var(--border)] bg-[var(--bg-elevated)] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isStreaming}
            placeholder="Ask AI to write, tweak, or fix code..."
            className="flex-1 app-input px-3.5 py-2 rounded-xl text-xs"
          />
          <button
            type="submit"
            disabled={isStreaming || !inputPrompt.trim()}
            className="btn-accent px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <BsSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatDrawer;
