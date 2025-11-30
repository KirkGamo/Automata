import { usePumpingStore } from './lib/store';
import { LANGUAGES } from './lib/languages';
import { DecompositionControl } from './components/DecompositionControl';
import { PumpingControl } from './components/PumpingControl';
import { VisualizationCanvas } from './components/VisualizationCanvas';
import './App.css';

function App() {
  const { mode, language, testString, pumpingLength, segments, pumpedResult, setMode, setLanguage, generateString } = usePumpingStore();

  const currentLanguageInfo = LANGUAGES.find((l) => l.id === language);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔄 Pumping Lemma Visualizer</h1>
        <p>Interactive visualization tool for understanding the Pumping Lemma</p>
      </header>

      <main className="app-main">
        {/* Left Sidebar - Controls */}
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

          {testString && <DecompositionControl />}
        </section>

        {/* Top Center - String Display */}
        {testString && (
          <section className="string-display">
            <h2>Test String Generated</h2>
            <div className="test-string">
              <code>{testString}</code>
            </div>
            <p className="string-info">
              Length: {testString.length} (≥ pumping length {pumpingLength})
            </p>
          </section>
        )}

        {/* Bottom Center - Visualization Area */}
        {testString && segments && (
          <div className="visualization-area">
            <PumpingControl />
            <VisualizationCanvas pumpedString={pumpedResult?.string} />
          </div>
        )}

        <section className="info-panel">
          <h2>About the Pumping Lemma</h2>
          
          <div className="lemma-explanation">
            <p>
              The Pumping Lemma is a property of {mode === 'regular' ? 'regular' : 'context-free'} languages 
              that states: if a language is {mode === 'regular' ? 'regular' : 'context-free'}, then any 
              sufficiently long string in the language can be "pumped" (repeated parts) and still remain in the language.
            </p>
            <p>
              <strong>How to use this tool to prove a language is NOT {mode === 'regular' ? 'regular' : 'context-free'}:</strong>
            </p>
            <ol>
              <li>Generate a test string from the language</li>
              <li>Split it according to the lemma conditions</li>
              <li>Pump it with different values of i</li>
              <li>If you find any i where the pumped string is NOT in the language, you've proven the language is not {mode === 'regular' ? 'regular' : 'context-free'}!</li>
            </ol>
          </div>
          
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
