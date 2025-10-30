import { usePumpingStore } from './lib/store';
import { LANGUAGES } from './lib/languages';
import './App.css';

function App() {
  const { mode, language, testString, pumpingLength, setMode, setLanguage, generateString } = usePumpingStore();

  const currentLanguageInfo = LANGUAGES.find((l) => l.id === language);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔄 Pumping Lemma Visualizer</h1>
        <p>Interactive visualization tool for understanding the Pumping Lemma</p>
      </header>

      <main className="app-main">
        <section className="control-panel">
          <div className="control-group">
            <label htmlFor="lemma-mode">Lemma Mode:</label>
            <select
              id="lemma-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'regular' | 'context-free')}
              className="control-select"
            >
              <option value="regular">Regular Pumping Lemma</option>
              <option value="context-free">Context-Free Pumping Lemma</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="language-select">Language:</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="control-select"
            >
              {LANGUAGES.filter((lang) => lang.mode === mode).map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {currentLanguageInfo && (
            <div className="language-info">
              <p className="language-description">{currentLanguageInfo.description}</p>
              <p className="language-example">
                <strong>Examples:</strong> {currentLanguageInfo.example}
              </p>
            </div>
          )}

          <div className="control-group">
            <label>Pumping Length (p): {pumpingLength}</label>
          </div>

          <button onClick={generateString} className="btn btn-primary">
            Generate Test String
          </button>
        </section>

        {testString && (
          <section className="string-display">
            <h2>Test String</h2>
            <div className="test-string">
              <code>{testString}</code>
            </div>
            <p className="string-info">
              Length: {testString.length} (≥ pumping length {pumpingLength})
            </p>
          </section>
        )}

        <section className="info-panel">
          <h2>How to use:</h2>
          <ol>
            <li>Select a lemma mode (Regular or Context-Free)</li>
            <li>Choose a language from the dropdown</li>
            <li>Click "Generate Test String" to create a string</li>
            <li>Split the string into segments (coming soon)</li>
            <li>Choose a pump count and visualize the result (coming soon)</li>
          </ol>
          
          <div className="lemma-conditions">
            <h3>{mode === 'regular' ? 'Regular' : 'Context-Free'} Pumping Lemma Conditions:</h3>
            {mode === 'regular' ? (
              <ul>
                <li>|y| &gt; 0 (y must be non-empty)</li>
                <li>|xy| ≤ p (x and y together must not exceed pumping length)</li>
                <li>For all i ≥ 0: xy<sup>i</sup>z ∈ L</li>
              </ul>
            ) : (
              <ul>
                <li>|vx| &gt; 0 (at least one of v or x must be non-empty)</li>
                <li>|vwx| ≤ p (v, w, and x together must not exceed pumping length)</li>
                <li>For all i ≥ 0: uv<sup>i</sup>wx<sup>i</sup>y ∈ L</li>
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
