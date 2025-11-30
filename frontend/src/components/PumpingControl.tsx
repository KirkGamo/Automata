import { useState } from 'react';
import { usePumpingStore } from '../lib/store';
import { pumpRegularString, pumpCFString } from '../lib/pumpingLogic';
import { checkMembership } from '../lib/membership';
import type { RegularSegments, CFSegments } from '../types/lemma';
import './PumpingControl.css';

export function PumpingControl() {
  const { mode, language, testString, segments, pumpCount, setPumpCount, setPumpedResult } = usePumpingStore();
  const [pumpedResult, setPumpedResultLocal] = useState<{
    string: string;
    isValid: boolean;
  } | null>(null);

  if (!testString || !segments) {
    return null;
  }

  const handlePump = () => {
    let pumpedString: string;

    if (mode === 'regular') {
      pumpedString = pumpRegularString(segments as RegularSegments, pumpCount);
    } else {
      pumpedString = pumpCFString(segments as CFSegments, pumpCount);
    }

    const isValid = checkMembership(pumpedString, language);
    const result = { string: pumpedString, isValid };
    setPumpedResultLocal(result);
    setPumpedResult(result);
  };

  const renderSegmentPreview = () => {
    if (mode === 'regular') {
      const { x, y, z } = segments as RegularSegments;
      return (
        <div className="segment-preview">
          <span className="segment segment-x">{x}</span>
          <span className="segment segment-y">{y}</span>
          <span className="segment segment-z">{z}</span>
        </div>
      );
    } else {
      const { u, v, w, x, y } = segments as CFSegments;
      return (
        <div className="segment-preview">
          <span className="segment segment-u">{u}</span>
          <span className="segment segment-v">{v}</span>
          <span className="segment segment-w">{w}</span>
          <span className="segment segment-x">{x}</span>
          <span className="segment segment-y">{y}</span>
        </div>
      );
    }
  };

  const renderPumpFormula = () => {
    if (mode === 'regular') {
      return (
        <div className="pump-formula">
          <code>
            xy<sup>{pumpCount}</sup>z
          </code>
        </div>
      );
    } else {
      return (
        <div className="pump-formula">
          <code>
            uv<sup>{pumpCount}</sup>wx<sup>{pumpCount}</sup>y
          </code>
        </div>
      );
    }
  };

  return (
    <section className="pumping-control">
      <h2>Step 3: Pump the String</h2>
      <p className="instruction">
        Choose how many times to pump (i = 0, 1, 2, 3...) and see if the result is still in the language.
      </p>

      <div className="current-decomposition">
        <h3>Current Decomposition:</h3>
        {renderSegmentPreview()}
      </div>

      <div className="pump-input-group">
        <label htmlFor="pump-count">
          Pump count (i):
        </label>
        <div className="pump-slider-container">
          <input
            id="pump-count"
            type="range"
            min="0"
            max="5"
            value={pumpCount}
            onChange={(e) => setPumpCount(Number(e.target.value))}
            className="pump-slider"
          />
          <input
            type="number"
            min="0"
            max="10"
            value={pumpCount}
            onChange={(e) => setPumpCount(Number(e.target.value))}
            className="pump-number-input"
            aria-label="Pump count number input"
          />
        </div>
      </div>

      {renderPumpFormula()}

      <button onClick={handlePump} className="btn btn-primary">
        Pump String
      </button>

      {pumpedResult && (
        <>
          <div className="result-modal-overlay" onClick={() => setPumpedResultLocal(null)}></div>
          <div className={`result-modal ${pumpedResult.isValid ? 'valid' : 'invalid'}`}>
            <button 
              className="result-modal-close" 
              onClick={() => setPumpedResultLocal(null)}
              aria-label="Close result"
            >
              ×
            </button>
            <h3>{pumpedResult.isValid ? '✅ Valid' : '❌ Invalid'}</h3>
            <div className="pumped-string">
              <label>Pumped string:</label>
              <code>{pumpedResult.string}</code>
            </div>
            <p className="result-explanation">
              {pumpedResult.isValid ? (
                <>
                  The pumped string <strong>is still in the language</strong>. This means the decomposition 
                  passed the test for i = {pumpCount}.
                </>
              ) : (
                <>
                  The pumped string <strong>is NOT in the language</strong>! This proves the language 
                  cannot be {mode === 'regular' ? 'regular' : 'context-free'} because we found a counterexample 
                  where pumping failed.
                </>
              )}
            </p>
            <div className="result-details">
              <p>
                <strong>Original length:</strong> {testString.length}
              </p>
              <p>
                <strong>Pumped length:</strong> {pumpedResult.string.length}
              </p>
              {mode === 'regular' && (
                <p>
                  <strong>Formula used:</strong> x + y × {pumpCount} + z
                </p>
              )}
              {mode === 'context-free' && (
                <p>
                  <strong>Formula used:</strong> u + v × {pumpCount} + w + x × {pumpCount} + y
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
