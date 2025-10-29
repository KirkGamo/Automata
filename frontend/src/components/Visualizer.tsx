import React, { useMemo, useState } from 'react';

function simpleCheckANBN(s: string) {
  const m = s.match(/^(a+)(b+)$/);
  if (!m) return false;
  return m[1].length === m[2].length;
}

export default function Visualizer() {
  // core inputs
  const [input, setInput] = useState('aaaaabbbbb');
  // splitting indices for y: [yStart, yEnd) – zero-based
  const [yStart, setYStart] = useState(1);
  const [yEnd, setYEnd] = useState(2);
  const [iTimes, setITimes] = useState(0);
  const pumpingLength = 5;
  const [serverResult, setServerResult] = useState<string | null>(null);

  // derived parts
  const parts = useMemo(() => {
    const s = input || '';
    const safeStart = Math.max(0, Math.min(yStart, s.length));
    // allow safeEnd to equal safeStart so y may be empty; validation will catch |y| > 0
    const safeEnd = Math.max(safeStart, Math.min(yEnd, s.length));
    const x = s.slice(0, safeStart);
    const y = s.slice(safeStart, safeEnd);
    const z = s.slice(safeEnd);
    return { x, y, z, safeStart, safeEnd };
  }, [input, yStart, yEnd]);

  const pumped = useMemo(() => {
    return parts.x + parts.y.repeat(Math.max(0, iTimes)) + parts.z;
  }, [parts, iTimes]);

  const localCheckOriginal = useMemo(() => simpleCheckANBN(input), [input]);
  const localCheckPumped = useMemo(() => simpleCheckANBN(pumped), [pumped]);

  // validation for split: |y| > 0 and |xy| <= pumpingLength
  const validation = useMemo(() => {
    const yLen = parts.y.length;
    const xyLen = parts.x.length + parts.y.length;
    const problems: string[] = [];
    if (yLen <= 0) problems.push('|y| must be > 0');
    if (xyLen > pumpingLength) problems.push('|xy| must be ≤ p');
    return { ok: problems.length === 0, problems };
  }, [parts, pumpingLength]);

  async function runServerCheck(target: string) {
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'a^n b^n', string: target }),
      });
      if (res.ok) {
        const json = await res.json();
        setServerResult(json.result ? 'SERVER: IN' : 'SERVER: NOT IN');
      } else {
        setServerResult('SERVER: ERROR');
      }
    } catch (e) {
      setServerResult('SERVER: UNAVAILABLE');
    }
  }

  return (
    <div className="visualizer">
      <h3>Pumping Lemma Visualizer — Regular</h3>

      <div className="controls-row">
        <label htmlFor="test-string">Test string:</label>
        <input
          id="test-string"
          aria-label="Test string"
          placeholder="e.g. aaaaabbbbb"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="mt-05">
        <strong>Split y (indices are zero-based, end exclusive)</strong>
        <div className="controls-row" aria-label="Split controls">
          <label htmlFor="y-start">y start:</label>
          <input
            id="y-start"
            type="number"
            min={0}
            max={Math.max(0, input.length - 1)}
            value={yStart}
            title="y start"
            onChange={(e) => setYStart(Number(e.target.value))}
          />

          <label htmlFor="y-end" className="ml-05">
            y end:
          </label>
          <input
            id="y-end"
            type="number"
            min={1}
            max={input.length}
            value={yEnd}
            title="y end"
            onChange={(e) => setYEnd(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-05 controls-row">
        <label htmlFor="i-times">Pump repetitions (i):</label>
        <input
          id="i-times"
          type="number"
          min={0}
          value={iTimes}
          title="i times"
          onChange={(e) => setITimes(Number(e.target.value))}
        />
        <button className="ml-05" onClick={() => runServerCheck(input)} disabled={!validation.ok}>
          Check original (server)
        </button>
        <button className="ml-05" onClick={() => runServerCheck(pumped)} disabled={!validation.ok}>
          Check pumped (server)
        </button>
      </div>

      <div aria-live="polite" className="mt-05" role="status">
        {!validation.ok && (
          <div className="result validation-error">{validation.problems.join('; ')}</div>
        )}
      </div>

      <div className="mt-075">
        <div>
          <span className="x-seg">{parts.x}</span>
          <span className="y-seg">{parts.y}</span>
          <span className="z-seg">{parts.z}</span>
        </div>
        <div className="mt-05">
          <strong>Pumped string (i = {iTimes}):</strong>
          <div className="pumped-result">{pumped}</div>
        </div>
      </div>

      <div className="mt-05">
        <div>Original local check: {localCheckOriginal ? 'IN' : 'NOT IN'}</div>
        <div>Pumped local check: {localCheckPumped ? 'IN' : 'NOT IN'}</div>
        {serverResult && <div className="result">{serverResult}</div>}
      </div>

      <p className="mt-075">
        Constraints: <code>|y| &gt; 0</code> and <code>|xy| ≤ p</code> (p = {pumpingLength})
      </p>

      <p>
        Try: <code>aaaaabbbbb</code> (valid) or <code>aaabbb</code> (valid) or <code>aaaabbb</code>
        (invalid)
      </p>
    </div>
  );
}
