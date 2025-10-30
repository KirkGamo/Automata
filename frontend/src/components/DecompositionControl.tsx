import { useState, useEffect } from 'react';
import { usePumpingStore } from '../lib/store';
import { validateRegularSegments, validateCFSegments } from '../lib/membership';
import type { RegularSegments, CFSegments } from '../types/lemma';
import './DecompositionControl.css';

export function DecompositionControl() {
  const { mode, testString, pumpingLength, segments, setSegments } = usePumpingStore();
  
  // Local state for input fields
  const [localSegments, setLocalSegments] = useState<RegularSegments | CFSegments>(
    mode === 'regular'
      ? { x: '', y: '', z: '' }
      : { u: '', v: '', w: '', x: '', y: '' }
  );

  const [errors, setErrors] = useState<string[]>([]);

  // Reset when mode or test string changes
  useEffect(() => {
    if (mode === 'regular') {
      setLocalSegments({ x: '', y: '', z: '' });
    } else {
      setLocalSegments({ u: '', v: '', w: '', x: '', y: '' });
    }
    setErrors([]);
    setSegments(null);
  }, [mode, testString, setSegments]);

  if (!testString) {
    return null;
  }

  const handleInputChange = (segment: string, value: string) => {
    setLocalSegments((prev) => ({ ...prev, [segment]: value }));
  };

  const validateAndApply = () => {
    const newErrors: string[] = [];

    if (mode === 'regular') {
      const segs = localSegments as RegularSegments;
      
      // Check concatenation
      const concatenated = segs.x + segs.y + segs.z;
      if (concatenated !== testString) {
        newErrors.push(`Segments must concatenate to original string. Got: "${concatenated}"`);
      }

      // Validate conditions
      const validation = validateRegularSegments(segs.x, segs.y, segs.z, pumpingLength);
      if (!validation.isValid) {
        newErrors.push(...validation.errors);
      }
    } else {
      const segs = localSegments as CFSegments;
      
      // Check concatenation
      const concatenated = segs.u + segs.v + segs.w + segs.x + segs.y;
      if (concatenated !== testString) {
        newErrors.push(`Segments must concatenate to original string. Got: "${concatenated}"`);
      }

      // Validate conditions
      const validation = validateCFSegments(segs.u, segs.v, segs.w, segs.x, segs.y, pumpingLength);
      if (!validation.isValid) {
        newErrors.push(...validation.errors);
      }
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setSegments(localSegments);
    }
  };

  const useSuggestion = () => {
    if (mode === 'regular') {
      // Suggest a split: x = first half, y = one char, z = rest
      const halfPoint = Math.min(Math.floor(testString.length / 2), pumpingLength - 1);
      setLocalSegments({
        x: testString.slice(0, halfPoint),
        y: testString.slice(halfPoint, halfPoint + 1),
        z: testString.slice(halfPoint + 1),
      });
    } else {
      // Suggest a CF split: u and y are outer parts, v and x are small pumping parts, w is middle
      const quarterPoint = Math.floor(testString.length / 4);
      const midPoint = Math.floor(testString.length / 2);
      setLocalSegments({
        u: testString.slice(0, quarterPoint),
        v: testString.slice(quarterPoint, quarterPoint + 1),
        w: testString.slice(quarterPoint + 1, midPoint),
        x: testString.slice(midPoint, midPoint + 1),
        y: testString.slice(midPoint + 1),
      });
    }
  };

  const renderRegularInputs = () => {
    const segs = localSegments as RegularSegments;
    return (
      <div className="segment-inputs">
        <div className="segment-input-group">
          <label htmlFor="segment-x" className="segment-x-label">
            x
          </label>
          <input
            id="segment-x"
            type="text"
            value={segs.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            placeholder="First part"
            className="segment-input segment-x-input"
          />
          <span className="segment-length">|x| = {segs.x.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-y" className="segment-y-label">
            y
          </label>
          <input
            id="segment-y"
            type="text"
            value={segs.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            placeholder="Pumped part"
            className="segment-input segment-y-input"
          />
          <span className="segment-length">|y| = {segs.y.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-z" className="segment-z-label">
            z
          </label>
          <input
            id="segment-z"
            type="text"
            value={segs.z}
            onChange={(e) => handleInputChange('z', e.target.value)}
            placeholder="Last part"
            className="segment-input segment-z-input"
          />
          <span className="segment-length">|z| = {segs.z.length}</span>
        </div>

        <div className="segment-constraint">
          |xy| = {segs.x.length + segs.y.length} (must be ≤ {pumpingLength})
        </div>
      </div>
    );
  };

  const renderCFInputs = () => {
    const segs = localSegments as CFSegments;
    return (
      <div className="segment-inputs">
        <div className="segment-input-group">
          <label htmlFor="segment-u" className="segment-u-label">
            u
          </label>
          <input
            id="segment-u"
            type="text"
            value={segs.u}
            onChange={(e) => handleInputChange('u', e.target.value)}
            placeholder="First part"
            className="segment-input segment-u-input"
          />
          <span className="segment-length">|u| = {segs.u.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-v" className="segment-v-label">
            v
          </label>
          <input
            id="segment-v"
            type="text"
            value={segs.v}
            onChange={(e) => handleInputChange('v', e.target.value)}
            placeholder="First pumped"
            className="segment-input segment-v-input"
          />
          <span className="segment-length">|v| = {segs.v.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-w" className="segment-w-label">
            w
          </label>
          <input
            id="segment-w"
            type="text"
            value={segs.w}
            onChange={(e) => handleInputChange('w', e.target.value)}
            placeholder="Middle part"
            className="segment-input segment-w-input"
          />
          <span className="segment-length">|w| = {segs.w.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-x" className="segment-x-label">
            x
          </label>
          <input
            id="segment-x"
            type="text"
            value={segs.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            placeholder="Second pumped"
            className="segment-input segment-x-input"
          />
          <span className="segment-length">|x| = {segs.x.length}</span>
        </div>

        <div className="segment-input-group">
          <label htmlFor="segment-y" className="segment-y-label">
            y
          </label>
          <input
            id="segment-y"
            type="text"
            value={segs.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            placeholder="Last part"
            className="segment-input segment-y-input"
          />
          <span className="segment-length">|y| = {segs.y.length}</span>
        </div>

        <div className="segment-constraint">
          |vwx| = {segs.v.length + segs.w.length + segs.x.length} (must be ≤ {pumpingLength})
          <br />
          |vx| = {segs.v.length + segs.x.length} (must be &gt; 0)
        </div>
      </div>
    );
  };

  return (
    <section className="decomposition-control">
      <h2>Step 2: Decompose the String</h2>
      <p className="instruction">
        Split the test string into segments according to the {mode} pumping lemma rules.
      </p>

      {mode === 'regular' ? renderRegularInputs() : renderCFInputs()}

      <div className="decomposition-actions">
        <button onClick={useSuggestion} className="btn btn-secondary">
          Use Suggested Split
        </button>
        <button onClick={validateAndApply} className="btn btn-primary">
          Apply Split
        </button>
      </div>

      {errors.length > 0 && (
        <div className="error-panel">
          <h4>❌ Validation Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {segments && errors.length === 0 && (
        <div className="success-panel">
          <h4>✅ Valid decomposition!</h4>
          <p>The string has been successfully split. You can now proceed to pump it.</p>
        </div>
      )}
    </section>
  );
}
