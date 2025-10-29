import React, { useState } from 'react'

function simpleCheckANBN(s: string) {
  // returns true if s is a^n b^n
  const m = s.match(/^(a+)(b+)$/)
  if (!m) return false
  return m[1].length === m[2].length
}

export default function Visualizer() {
  const [input, setInput] = useState('aaaaabbbbb')
  const [result, setResult] = useState<string | null>(null)

  async function runCheck() {
    // try local check first
    const local = simpleCheckANBN(input)
    setResult(local ? 'IN (a^n b^n)' : 'NOT IN (a^n b^n)')

    // attempt server check (optional)
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'a^n b^n', string: input })
      })
      if (res.ok) {
        const json = await res.json()
        setResult(json.result ? 'SERVER: IN' : 'SERVER: NOT IN')
      }
    } catch (e) {
      // server not running; keep local result
    }
  }

  return (
    <div className="visualizer">
      <label>Test string:</label>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={runCheck}>Check</button>
      {result && <div className="result">{result}</div>}
      <p>Try: <code>aaaaabbbbb</code> (valid) or <code>aaabbb</code> (valid) or <code>aaaabbb</code> (invalid)</p>
    </div>
  )
}
