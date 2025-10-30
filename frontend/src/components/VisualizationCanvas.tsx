import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { usePumpingStore } from '../lib/store';
import type { RegularSegments, CFSegments } from '../types/lemma';
import './VisualizationCanvas.css';

interface VisualizationCanvasProps {
  pumpedString?: string;
  isAnimating?: boolean;
}

export function VisualizationCanvas({ pumpedString, isAnimating = false }: VisualizationCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { mode, segments, pumpCount, testString } = usePumpingStore();

  useEffect(() => {
    if (!svgRef.current || !segments || !testString) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const width = svgRef.current.clientWidth;

    // Add arrowhead marker definition (used by both modes)
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 5)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', '#94a3b8');

    // Create main group
    const g = svg.append('g').attr('transform', `translate(${width / 2}, 50)`);

    if (mode === 'regular') {
      renderRegularVisualization(g, segments as RegularSegments, pumpedString, isAnimating);
    } else {
      renderCFVisualization(g, segments as CFSegments, pumpedString, isAnimating);
    }
  }, [mode, segments, pumpCount, testString, pumpedString, isAnimating]);

  const renderRegularVisualization = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    segs: RegularSegments,
    pumped?: string,
    animate?: boolean
  ) => {
    const { x, y, z } = segs;
    const segmentColors = { x: '#3b82f6', y: '#ef4444', z: '#10b981' };
    
    // Original string
    g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'viz-label')
      .text('Original (i = 1):');

    const originalGroup = g.append('g').attr('transform', 'translate(0, 20)');
    
    let xOffset = -((x.length + y.length + z.length) * 10);
    
    // X segment
    originalGroup.append('rect')
      .attr('x', xOffset)
      .attr('y', 0)
      .attr('width', x.length * 20)
      .attr('height', 40)
      .attr('fill', segmentColors.x)
      .attr('opacity', 0.7)
      .attr('rx', 5);
    
    originalGroup.append('text')
      .attr('x', xOffset + (x.length * 10))
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('class', 'segment-text')
      .text(x);

    xOffset += x.length * 20 + 5;

    // Y segment (will be pumped)
    originalGroup.append('rect')
      .attr('x', xOffset)
      .attr('y', 0)
      .attr('width', y.length * 20)
      .attr('height', 40)
      .attr('fill', segmentColors.y)
      .attr('opacity', 0.7)
      .attr('rx', 5);
    
    originalGroup.append('text')
      .attr('x', xOffset + (y.length * 10))
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('class', 'segment-text')
      .text(y);

    xOffset += y.length * 20 + 5;

    // Z segment
    originalGroup.append('rect')
      .attr('x', xOffset)
      .attr('y', 0)
      .attr('width', z.length * 20)
      .attr('height', 40)
      .attr('fill', segmentColors.z)
      .attr('opacity', 0.7)
      .attr('rx', 5);
    
    originalGroup.append('text')
      .attr('x', xOffset + (z.length * 10))
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('class', 'segment-text')
      .text(z);

    // Pumped string visualization
    if (pumped && pumpCount !== 1) {
      g.append('text')
        .attr('x', 0)
        .attr('y', 90)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-label')
        .text(`Pumped (i = ${pumpCount}):`);

      const pumpedGroup = g.append('g').attr('transform', 'translate(0, 120)');
      
      let pumpedOffset = -(x.length + (y.length * pumpCount) + z.length) * 10;

      // X segment (unchanged)
      pumpedGroup.append('rect')
        .attr('x', pumpedOffset)
        .attr('y', 0)
        .attr('width', x.length * 20)
        .attr('height', 40)
        .attr('fill', segmentColors.x)
        .attr('opacity', 0.7)
        .attr('rx', 5);
      
      pumpedGroup.append('text')
        .attr('x', pumpedOffset + (x.length * 10))
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-text')
        .text(x);

      pumpedOffset += x.length * 20 + 5;

      // Y segments (pumped i times)
      for (let i = 0; i < pumpCount; i++) {
        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', y.length * 20)
          .attr('height', 40)
          .attr('fill', segmentColors.y)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + (y.length * 10))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(y);

        if (animate) {
          rect.attr('opacity', 0).transition().duration(300).delay(i * 200).attr('opacity', 0.7);
          text.attr('opacity', 0).transition().duration(300).delay(i * 200).attr('opacity', 1);
        }

        pumpedOffset += y.length * 20 + 5;
      }

      // Z segment (unchanged)
      pumpedGroup.append('rect')
        .attr('x', pumpedOffset)
        .attr('y', 0)
        .attr('width', z.length * 20)
        .attr('height', 40)
        .attr('fill', segmentColors.z)
        .attr('opacity', 0.7)
        .attr('rx', 5);
      
      pumpedGroup.append('text')
        .attr('x', pumpedOffset + (z.length * 10))
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-text')
        .text(z);

      // Arrow connecting original to pumped
      g.append('path')
        .attr('d', 'M 0,70 L 0,90')
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    }
  };

  const renderCFVisualization = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    segs: CFSegments,
    pumped?: string,
    animate?: boolean
  ) => {
    const { u, v, w, x, y } = segs;
    const segmentColors = {
      u: '#3b82f6',
      v: '#8b5cf6',
      w: '#f59e0b',
      x: '#ef4444',
      y: '#10b981'
    };
    
    // Original string
    g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'viz-label')
      .text('Original (i = 1):');

    const originalGroup = g.append('g').attr('transform', 'translate(0, 20)');
    
    let xOffset = -((u.length + v.length + w.length + x.length + y.length) * 8);
    
    const segments = [
      { key: 'u', value: u, color: segmentColors.u },
      { key: 'v', value: v, color: segmentColors.v },
      { key: 'w', value: w, color: segmentColors.w },
      { key: 'x', value: x, color: segmentColors.x },
      { key: 'y', value: y, color: segmentColors.y }
    ];

    segments.forEach((seg) => {
      if (seg.value.length === 0) return;

      originalGroup.append('rect')
        .attr('x', xOffset)
        .attr('y', 0)
        .attr('width', seg.value.length * 16)
        .attr('height', 40)
        .attr('fill', seg.color)
        .attr('opacity', 0.7)
        .attr('rx', 5);
      
      originalGroup.append('text')
        .attr('x', xOffset + (seg.value.length * 8))
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-text')
        .text(seg.value);

      xOffset += seg.value.length * 16 + 5;
    });

    // Pumped string visualization
    if (pumped && pumpCount !== 1) {
      g.append('text')
        .attr('x', 0)
        .attr('y', 90)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-label')
        .text(`Pumped (i = ${pumpCount}):`);

      const pumpedGroup = g.append('g').attr('transform', 'translate(0, 120)');
      
      const totalLength = u.length + (v.length * pumpCount) + w.length + (x.length * pumpCount) + y.length;
      let pumpedOffset = -(totalLength * 8);

      // U segment
      if (u.length > 0) {
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', u.length * 16)
          .attr('height', 40)
          .attr('fill', segmentColors.u)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + (u.length * 8))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(u);

        pumpedOffset += u.length * 16 + 5;
      }

      // V segments (pumped i times)
      for (let i = 0; i < pumpCount; i++) {
        if (v.length === 0) continue;

        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', v.length * 16)
          .attr('height', 40)
          .attr('fill', segmentColors.v)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + (v.length * 8))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(v);

        if (animate) {
          rect.attr('opacity', 0).transition().duration(300).delay(i * 200).attr('opacity', 0.7);
          text.attr('opacity', 0).transition().duration(300).delay(i * 200).attr('opacity', 1);
        }

        pumpedOffset += v.length * 16 + 5;
      }

      // W segment
      if (w.length > 0) {
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', w.length * 16)
          .attr('height', 40)
          .attr('fill', segmentColors.w)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + (w.length * 8))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(w);

        pumpedOffset += w.length * 16 + 5;
      }

      // X segments (pumped i times)
      for (let i = 0; i < pumpCount; i++) {
        if (x.length === 0) continue;

        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', x.length * 16)
          .attr('height', 40)
          .attr('fill', segmentColors.x)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + (x.length * 8))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(x);

        if (animate) {
          rect.attr('opacity', 0).transition().duration(300).delay((i + pumpCount) * 200).attr('opacity', 0.7);
          text.attr('opacity', 0).transition().duration(300).delay((i + pumpCount) * 200).attr('opacity', 1);
        }

        pumpedOffset += x.length * 16 + 5;
      }

      // Y segment
      if (y.length > 0) {
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', y.length * 16)
          .attr('height', 40)
          .attr('fill', segmentColors.y)
          .attr('opacity', 0.7)
          .attr('rx', 5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + (y.length * 8))
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .text(y);
      }

      // Arrow
      g.append('path')
        .attr('d', 'M 0,70 L 0,90')
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    }
  };

  if (!segments || !testString) {
    return (
      <section className="visualization-canvas empty">
        <p className="empty-message">Generate a test string and decompose it to see the visualization.</p>
      </section>
    );
  }

  return (
    <section className="visualization-canvas">
      <h2>Visual Representation</h2>
      <svg ref={svgRef} className="viz-svg" />
    </section>
  );
}
