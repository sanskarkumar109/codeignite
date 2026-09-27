import React, { useState } from 'react';
import { FiPlay, FiCheckCircle, FiXCircle, FiX, FiRefreshCw, FiTerminal } from 'react-icons/fi';
import { BsMagic, BsLightningCharge } from 'react-icons/bs';
import { api_base_url } from '../helper';

const TestRunnerTerminal = ({
  isOpen,
  onClose,
  projectTitle,
  htmlCode,
  cssCode,
  jsCode,
  onTriggerAiFix
}) => {
  const [suiteName, setSuiteName] = useState('AI Automated DOM & Logic Test Suite');
  const [testResults, setTestResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  if (!isOpen) return null;

  const runTestAssertions = (testsList) => {
    setIsExecuting(true);
    const iframe = document.getElementById('iframe');
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
    const iframeWin = iframe?.contentWindow;

    const results = testsList.map((t) => {
      const startTime = performance.now();
      let passed = false;
      let errorMsg = null;

      try {
        if (!iframeDoc || !iframeWin) {
          throw new Error('Canvas iframe execution context unavailable');
        }

        // Execute assertion in iframe document scope
        const testFn = new Function('document', 'window', t.assertion);
        const result = testFn(iframeDoc, iframeWin);
        passed = !!result;
      } catch (err) {
        passed = false;
        errorMsg = err.message || 'Assertion thrown exception';
      }

      const duration = Math.round(performance.now() - startTime);
      return {
        ...t,
        passed,
        duration,
        errorMsg
      };
    });

    setTestResults(results);
    setIsExecuting(false);
    setHasRun(true);
  };

  const handleGenerateAndRun = async () => {
    setIsGenerating(true);
    setHasRun(false);

    try {
      const res = await fetch(`${api_base_url}/generateTests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          htmlCode,
          cssCode,
          jsCode
        })
      });

      const data = await res.json();
      setIsGenerating(false);

      if (data.success && data.tests && data.tests.length > 0) {
        setSuiteName(data.suiteName || 'AI Automated Test Suite');
        runTestAssertions(data.tests);
      } else {
        alert(data.message || 'Failed to generate AI tests.');
      }
    } catch (err) {
      setIsGenerating(false);
      console.error('Test generation error:', err);
      alert('Error connecting to AI Test Generation service.');
    }
  };

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const isAllPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-secondary)] border-t border-[var(--border)] shadow-2xl flex flex-col max-h-[380px] animate-in slide-in-from-bottom duration-200">
      {/* Terminal Header */}
      <div className="h-12 px-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
            <FiTerminal className="text-base text-[var(--accent)]" />
            <span>AI Automated Test Runner</span>
          </div>

          {hasRun && (
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isAllPassed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {isAllPassed ? `✓ 100% PASSED (${passedCount}/${totalCount})` : `⚠️ FAILED (${passedCount}/${totalCount} Passed)`}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAndRun}
            disabled={isGenerating || isExecuting}
            className="btn-accent px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <BsMagic className="animate-spin" /> Generating Tests...
              </>
            ) : (
              <>
                <FiPlay /> Run AI Tests
              </>
            )}
          </button>

          {!isAllPassed && hasRun && (
            <button
              onClick={() => onTriggerAiFix(testResults.filter(r => !r.passed).map(r => `${r.name}: ${r.errorMsg || 'Failed assertion'}`).join('; '))}
              className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <BsLightningCharge /> Fix Failed Tests
            </button>
          )}

          <button onClick={onClose} className="btn-secondary p-1.5 rounded-lg text-xs cursor-pointer">
            <FiX className="text-base" />
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs text-[var(--text-primary)] min-h-[160px]">
        {!hasRun && !isGenerating && (
          <div className="h-32 flex flex-col items-center justify-center text-center text-[var(--text-secondary)]">
            <FiTerminal className="text-3xl mb-2 text-[var(--accent)]/50" />
            <p className="text-xs font-medium">Click "Run AI Tests" to auto-generate and execute DOM & logic test assertions.</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-32 flex items-center justify-center gap-2 text-xs text-[var(--accent)] font-semibold animate-pulse">
            <BsMagic className="animate-spin text-base" />
            Analyzing HTML, CSS & JavaScript to generate automated test suite...
          </div>
        )}

        {hasRun && (
          <>
            <div className="text-[11px] text-[var(--text-secondary)] font-semibold border-b border-[var(--border)] pb-2 mb-2">
              Suite: <span className="text-[var(--text-primary)]">{suiteName}</span>
            </div>

            {testResults.map((t, index) => (
              <div
                key={t.id || index}
                className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                  t.passed
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.passed ? (
                      <FiCheckCircle className="text-emerald-400 text-sm shrink-0" />
                    ) : (
                      <FiXCircle className="text-rose-400 text-sm shrink-0" />
                    )}
                    <span className="font-semibold text-xs">{t.name}</span>
                  </div>

                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{t.duration}ms</span>
                </div>

                {t.description && (
                  <p className="text-[11px] text-[var(--text-secondary)] pl-6">{t.description}</p>
                )}

                {!t.passed && t.errorMsg && (
                  <div className="ml-6 mt-1 p-2 rounded-lg bg-red-950/60 border border-red-800/40 font-mono text-[10px] text-red-300">
                    Assertion Failure: {t.errorMsg}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TestRunnerTerminal;
