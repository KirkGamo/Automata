import { useEffect, useRef, useState } from 'react';
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
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const { mode, segments, pumpCount, testString, pumpingLength } = usePumpingStore();

  useEffect(() => {
    if (!svgRef.current || !segments || !testString) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Add gradient definitions
    const defs = svg.append('defs');
    
    // Gradient for segments
    const gradients = [
      { id: 'grad-x', color: '#3b82f6' },
      { id: 'grad-y', color: '#ef4444' },
      { id: 'grad-z', color: '#10b981' },
      { id: 'grad-u', color: '#3b82f6' },
      { id: 'grad-v', color: '#8b5cf6' },
      { id: 'grad-w', color: '#f59e0b' }
    ];

    gradients.forEach(({ id, color }) => {
      const gradient = defs.append('linearGradient')
        .attr('id', id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.6);
    });

    // Add arrowhead marker
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', '#64748b');

    // Add glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create main group with responsive positioning
    const g = svg.append('g').attr('transform', `translate(${width / 2}, 60)`);

    // Add background grid for better visual context
    const gridGroup = g.append('g').attr('class', 'grid-group').attr('opacity', 0.1);
    for (let i = -300; i < 300; i += 50) {
      gridGroup.append('line')
        .attr('x1', i)
        .attr('y1', -20)
        .attr('x2', i)
        .attr('y2', height - 60)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 0.5);
    }

    if (mode === 'regular') {
      renderRegularVisualization(g, segments as RegularSegments, pumpedString, isAnimating);
    } else {
      renderCFVisualization(g, segments as CFSegments, pumpedString, isAnimating);
    }
  }, [mode, segments, pumpCount, testString, pumpedString, isAnimating, pumpingLength]);

  const renderRegularVisualization = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    segs: RegularSegments,
    pumped?: string,
    animate?: boolean
  ) => {
    const { x, y, z } = segs;
    const segmentData = [
      { name: 'x', value: x, color: '#3b82f6', gradient: 'url(#grad-x)', label: 'x (prefix)' },
      { name: 'y', value: y, color: '#ef4444', gradient: 'url(#grad-y)', label: 'y (pumped)', isPumped: true },
      { name: 'z', value: z, color: '#10b981', gradient: 'url(#grad-z)', label: 'z (suffix)' }
    ];

    // Add legend
    const legend = g.append('g').attr('class', 'legend').attr('transform', 'translate(-280, -30)');
    
    segmentData.forEach((seg, i) => {
      const legendItem = legend.append('g').attr('transform', `translate(${i * 190}, 0)`);
      
      legendItem.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', seg.gradient)
        .attr('rx', 4)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(i * 100)
        .attr('opacity', 0.8);
      
      legendItem.append('text')
        .attr('x', 28)
        .attr('y', 15)
        .attr('class', 'legend-text')
        .text(seg.label)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(i * 100)
        .attr('opacity', 1);
    });
    
    // Original string title with animation
    g.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('class', 'viz-title')
      .text('Original Decomposition (i = 1):')
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .attr('opacity', 1);

    const originalGroup = g.append('g').attr('transform', 'translate(0, 45)');
    
    // Calculate responsive width based on string length
    const charWidth = Math.min(24, 600 / (x.length + y.length + z.length));
    let xOffset = -((x.length + y.length + z.length) * charWidth / 2);
    
    // Render segments with enhanced visuals
    segmentData.forEach((seg, i) => {
      if (seg.value.length === 0) return;

      const segWidth = seg.value.length * charWidth;
      const segGroup = originalGroup.append('g')
        .attr('class', `segment-group segment-${seg.name}`)
        .style('cursor', 'pointer');

      // Segment rectangle with gradient and animation
      const rect = segGroup.append('rect')
        .attr('x', xOffset)
        .attr('y', 0)
        .attr('width', segWidth)
        .attr('height', 48)
        .attr('fill', seg.gradient)
        .attr('stroke', seg.color)
        .attr('stroke-width', 2)
        .attr('rx', 6)
        .attr('opacity', 0)
        .attr('transform', `translate(0, -10)`)
        .on('mouseenter', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('filter', 'url(#glow)')
            .attr('stroke-width', 3)
            .attr('transform', 'translate(0, -2)');
          setHoveredSegment(seg.name);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('filter', null)
            .attr('stroke-width', 2)
            .attr('transform', 'translate(0, 0)');
          setHoveredSegment(null);
        });

      // Animate entrance
      if (animate) {
        rect.transition()
          .duration(600)
          .delay(i * 200)
          .attr('opacity', 0.85)
          .attr('transform', 'translate(0, 0)');
      } else {
        rect.attr('opacity', 0.85).attr('transform', 'translate(0, 0)');
      }
      
      // Segment text
      const text = segGroup.append('text')
        .attr('x', xOffset + segWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-text')
        .attr('fill', '#fff')
        .attr('font-weight', '600')
        .text(seg.value)
        .attr('opacity', 0);

      if (animate) {
        text.transition()
          .duration(400)
          .delay(i * 200 + 200)
          .attr('opacity', 1);
      } else {
        text.attr('opacity', 1);
      }

      // Segment label above
      segGroup.append('text')
        .attr('x', xOffset + segWidth / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-label')
        .text(seg.name)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(i * 200 + 300)
        .attr('opacity', 0.7);

      // Add length indicator for pumped segment
      if (seg.isPumped && pumpingLength) {
        segGroup.append('text')
          .attr('x', xOffset + segWidth / 2)
          .attr('y', 65)
          .attr('text-anchor', 'middle')
          .attr('class', 'length-indicator')
          .text(`|${seg.name}| = ${seg.value.length}`)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(i * 200 + 400)
          .attr('opacity', 0.6);
      }

      xOffset += segWidth + 8;
    });

    // Pumped string visualization
    if (pumped && pumpCount !== 1) {
      // Animated arrow with pump count indicator
      const arrowGroup = g.append('g').attr('class', 'arrow-group');
      
      arrowGroup.append('path')
        .attr('d', 'M 0,100 L 0,135')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrowhead)')
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(800)
        .attr('opacity', 0.8);

      // Pump count badge
      const badge = arrowGroup.append('g')
        .attr('transform', 'translate(25, 115)')
        .attr('opacity', 0);

      badge.append('circle')
        .attr('r', 18)
        .attr('fill', '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      badge.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('class', 'pump-badge')
        .attr('fill', '#fff')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(`i=${pumpCount}`);

      badge.transition()
        .duration(400)
        .delay(1000)
        .attr('opacity', 1);

      // Pumped string title
      g.append('text')
        .attr('x', 0)
        .attr('y', 160)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-title')
        .text(`Pumped String (i = ${pumpCount}):`)
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(1200)
        .attr('opacity', 1);

      const pumpedGroup = g.append('g').attr('transform', 'translate(0, 195)');
      
      const totalLength = x.length + (y.length * pumpCount) + z.length;
      const pumpedCharWidth = Math.min(24, 600 / totalLength);
      let pumpedOffset = -(totalLength * pumpedCharWidth / 2);

      // X segment (unchanged, dimmed)
      if (x.length > 0) {
        const xWidth = x.length * pumpedCharWidth;
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', xWidth)
          .attr('height', 48)
          .attr('fill', 'url(#grad-x)')
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1.5)
          .attr('rx', 6)
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(1400)
          .attr('opacity', 0.5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + xWidth / 2)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .attr('fill', '#fff')
          .text(x)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(1500)
          .attr('opacity', 0.7);

        pumpedOffset += xWidth + 8;
      }

      // Y segments (pumped i times) - HIGHLIGHTED
      for (let i = 0; i < pumpCount; i++) {
        if (y.length === 0) continue;

        const yWidth = y.length * pumpedCharWidth;
        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', yWidth)
          .attr('height', 48)
          .attr('fill', 'url(#grad-y)')
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 3)
          .attr('rx', 6)
          .attr('filter', 'url(#glow)')
          .attr('opacity', 0)
          .attr('transform', 'scale(0.8)');
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + yWidth / 2)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .attr('fill', '#fff')
          .attr('font-weight', 'bold')
          .text(y)
          .attr('opacity', 0);

        // Staggered animation for each pumped copy
        if (animate) {
          rect.transition()
            .duration(500)
            .delay(1600 + i * 250)
            .attr('opacity', 0.95)
            .attr('transform', 'scale(1)');
          
          text.transition()
            .duration(400)
            .delay(1700 + i * 250)
            .attr('opacity', 1);
        } else {
          rect.attr('opacity', 0.95).attr('transform', 'scale(1)');
          text.attr('opacity', 1);
        }

        // Add copy number indicator
        if (pumpCount > 2) {
          pumpedGroup.append('text')
            .attr('x', pumpedOffset + yWidth / 2)
            .attr('y', -8)
            .attr('text-anchor', 'middle')
            .attr('class', 'copy-indicator')
            .attr('fill', '#ef4444')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .text(`y${i + 1}`)
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .delay(1700 + i * 250)
            .attr('opacity', 0.8);
        }

        pumpedOffset += yWidth + 8;
      }

      // Z segment (unchanged, dimmed)
      if (z.length > 0) {
        const zWidth = z.length * pumpedCharWidth;
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', zWidth)
          .attr('height', 48)
          .attr('fill', 'url(#grad-z)')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 1.5)
          .attr('rx', 6)
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(1400)
          .attr('opacity', 0.5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + zWidth / 2)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text')
          .attr('fill', '#fff')
          .text(z)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(1500)
          .attr('opacity', 0.7);
      }
    }
  };

  const renderCFVisualization = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    segs: CFSegments,
    pumped?: string,
    animate?: boolean
  ) => {
    const { u, v, w, x, y } = segs;
    const segmentData = [
      { name: 'u', value: u, color: '#3b82f6', gradient: 'url(#grad-u)', label: 'u (prefix)' },
      { name: 'v', value: v, color: '#8b5cf6', gradient: 'url(#grad-v)', label: 'v (pumped)', isPumped: true },
      { name: 'w', value: w, color: '#f59e0b', gradient: 'url(#grad-w)', label: 'w (middle)' },
      { name: 'x', value: x, color: '#ef4444', gradient: 'url(#grad-y)', label: 'x (pumped)', isPumped: true },
      { name: 'y', value: y, color: '#10b981', gradient: 'url(#grad-z)', label: 'y (suffix)' }
    ];
    
    // Add legend for CF mode
    const legend = g.append('g').attr('class', 'legend').attr('transform', 'translate(-350, -30)');
    
    segmentData.forEach((seg, i) => {
      const legendItem = legend.append('g').attr('transform', `translate(${i * 145}, 0)`);
      
      legendItem.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', seg.gradient)
        .attr('rx', 3)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(i * 80)
        .attr('opacity', 0.8);
      
      legendItem.append('text')
        .attr('x', 24)
        .attr('y', 13)
        .attr('class', 'legend-text-small')
        .text(seg.label)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(i * 80)
        .attr('opacity', 1);
    });
    
    // Original string title
    g.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('class', 'viz-title')
      .text('Original Decomposition (i = 1):')
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .attr('opacity', 1);

    const originalGroup = g.append('g').attr('transform', 'translate(0, 45)');
    
    const totalLength = u.length + v.length + w.length + x.length + y.length;
    const charWidth = Math.min(20, 600 / totalLength);
    let xOffset = -(totalLength * charWidth / 2);
    
    // Render CF segments with enhanced visuals
    segmentData.forEach((seg, i) => {
      if (seg.value.length === 0) return;

      const segWidth = seg.value.length * charWidth;
      const segGroup = originalGroup.append('g')
        .attr('class', `segment-group cf-segment-${seg.name}`)
        .style('cursor', 'pointer');

      // Segment rectangle
      const rect = segGroup.append('rect')
        .attr('x', xOffset)
        .attr('y', 0)
        .attr('width', segWidth)
        .attr('height', 44)
        .attr('fill', seg.gradient)
        .attr('stroke', seg.color)
        .attr('stroke-width', 2)
        .attr('rx', 5)
        .attr('opacity', 0)
        .attr('transform', 'translate(0, -10)')
        .on('mouseenter', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('filter', 'url(#glow)')
            .attr('stroke-width', 3)
            .attr('transform', 'translate(0, -2)');
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('filter', null)
            .attr('stroke-width', 2)
            .attr('transform', 'translate(0, 0)');
        });

      if (animate) {
        rect.transition()
          .duration(600)
          .delay(i * 150)
          .attr('opacity', 0.85)
          .attr('transform', 'translate(0, 0)');
      } else {
        rect.attr('opacity', 0.85).attr('transform', 'translate(0, 0)');
      }
      
      // Segment text
      const text = segGroup.append('text')
        .attr('x', xOffset + segWidth / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-text-cf')
        .attr('fill', '#fff')
        .attr('font-weight', '600')
        .text(seg.value)
        .attr('opacity', 0);

      if (animate) {
        text.transition()
          .duration(400)
          .delay(i * 150 + 200)
          .attr('opacity', 1);
      } else {
        text.attr('opacity', 1);
      }

      // Segment label
      segGroup.append('text')
        .attr('x', xOffset + segWidth / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('class', 'segment-label')
        .text(seg.name)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(i * 150 + 300)
        .attr('opacity', 0.7);

      xOffset += segWidth + 6;
    });

    // Pumped string visualization for CF
    if (pumped && pumpCount !== 1) {
      // Animated arrow with pump count
      const arrowGroup = g.append('g').attr('class', 'arrow-group');
      
      arrowGroup.append('path')
        .attr('d', 'M 0,95 L 0,130')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrowhead)')
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(800)
        .attr('opacity', 0.8);

      // Pump count badge
      const badge = arrowGroup.append('g')
        .attr('transform', 'translate(25, 110)')
        .attr('opacity', 0);

      badge.append('circle')
        .attr('r', 18)
        .attr('fill', '#8b5cf6')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      badge.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('class', 'pump-badge')
        .attr('fill', '#fff')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(`i=${pumpCount}`);

      badge.transition()
        .duration(400)
        .delay(1000)
        .attr('opacity', 1);

      g.append('text')
        .attr('x', 0)
        .attr('y', 155)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-title')
        .text(`Pumped String (i = ${pumpCount}):`)
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(1200)
        .attr('opacity', 1);

      const pumpedGroup = g.append('g').attr('transform', 'translate(0, 190)');
      
      const totalLength = u.length + (v.length * pumpCount) + w.length + (x.length * pumpCount) + y.length;
      const pumpedCharWidth = Math.min(20, 600 / totalLength);
      let pumpedOffset = -(totalLength * pumpedCharWidth / 2);

      // U segment (dimmed)
      if (u.length > 0) {
        const uWidth = u.length * pumpedCharWidth;
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', uWidth)
          .attr('height', 44)
          .attr('fill', 'url(#grad-u)')
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1.5)
          .attr('rx', 5)
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(1400)
          .attr('opacity', 0.5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + uWidth / 2)
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text-cf')
          .attr('fill', '#fff')
          .text(u)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(1500)
          .attr('opacity', 0.7);

        pumpedOffset += uWidth + 6;
      }

      // V segments (pumped i times) - HIGHLIGHTED
      for (let i = 0; i < pumpCount; i++) {
        if (v.length === 0) continue;

        const vWidth = v.length * pumpedCharWidth;
        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', vWidth)
          .attr('height', 44)
          .attr('fill', 'url(#grad-v)')
          .attr('stroke', '#8b5cf6')
          .attr('stroke-width', 3)
          .attr('rx', 5)
          .attr('filter', 'url(#glow)')
          .attr('opacity', 0)
          .attr('transform', 'scale(0.8)');
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + vWidth / 2)
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text-cf')
          .attr('fill', '#fff')
          .attr('font-weight', 'bold')
          .text(v)
          .attr('opacity', 0);

        if (animate) {
          rect.transition()
            .duration(500)
            .delay(1600 + i * 200)
            .attr('opacity', 0.95)
            .attr('transform', 'scale(1)');
          
          text.transition()
            .duration(400)
            .delay(1700 + i * 200)
            .attr('opacity', 1);
        } else {
          rect.attr('opacity', 0.95).attr('transform', 'scale(1)');
          text.attr('opacity', 1);
        }

        if (pumpCount > 2) {
          pumpedGroup.append('text')
            .attr('x', pumpedOffset + vWidth / 2)
            .attr('y', -8)
            .attr('text-anchor', 'middle')
            .attr('class', 'copy-indicator')
            .attr('fill', '#8b5cf6')
            .attr('font-size', '9px')
            .attr('font-weight', 'bold')
            .text(`v${i + 1}`)
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .delay(1700 + i * 200)
            .attr('opacity', 0.8);
        }

        pumpedOffset += vWidth + 6;
      }

      // W segment (dimmed)
      if (w.length > 0) {
        const wWidth = w.length * pumpedCharWidth;
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', wWidth)
          .attr('height', 44)
          .attr('fill', 'url(#grad-w)')
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 1.5)
          .attr('rx', 5)
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(1400)
          .attr('opacity', 0.5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + wWidth / 2)
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text-cf')
          .attr('fill', '#fff')
          .text(w)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(1500)
          .attr('opacity', 0.7);

        pumpedOffset += wWidth + 6;
      }

      // X segments (pumped i times) - HIGHLIGHTED
      for (let i = 0; i < pumpCount; i++) {
        if (x.length === 0) continue;

        const xWidth = x.length * pumpedCharWidth;
        const rect = pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', xWidth)
          .attr('height', 44)
          .attr('fill', 'url(#grad-y)')
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 3)
          .attr('rx', 5)
          .attr('filter', 'url(#glow)')
          .attr('opacity', 0)
          .attr('transform', 'scale(0.8)');
        
        const text = pumpedGroup.append('text')
          .attr('x', pumpedOffset + xWidth / 2)
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text-cf')
          .attr('fill', '#fff')
          .attr('font-weight', 'bold')
          .text(x)
          .attr('opacity', 0);

        if (animate) {
          rect.transition()
            .duration(500)
            .delay(1600 + (i + pumpCount) * 200)
            .attr('opacity', 0.95)
            .attr('transform', 'scale(1)');
          
          text.transition()
            .duration(400)
            .delay(1700 + (i + pumpCount) * 200)
            .attr('opacity', 1);
        } else {
          rect.attr('opacity', 0.95).attr('transform', 'scale(1)');
          text.attr('opacity', 1);
        }

        if (pumpCount > 2) {
          pumpedGroup.append('text')
            .attr('x', pumpedOffset + xWidth / 2)
            .attr('y', -8)
            .attr('text-anchor', 'middle')
            .attr('class', 'copy-indicator')
            .attr('fill', '#ef4444')
            .attr('font-size', '9px')
            .attr('font-weight', 'bold')
            .text(`x${i + 1}`)
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .delay(1700 + (i + pumpCount) * 200)
            .attr('opacity', 0.8);
        }

        pumpedOffset += xWidth + 6;
      }

      // Y segment (dimmed)
      if (y.length > 0) {
        const yWidth = y.length * pumpedCharWidth;
        pumpedGroup.append('rect')
          .attr('x', pumpedOffset)
          .attr('y', 0)
          .attr('width', yWidth)
          .attr('height', 44)
          .attr('fill', 'url(#grad-z)')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 1.5)
          .attr('rx', 5)
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(1400)
          .attr('opacity', 0.5);
        
        pumpedGroup.append('text')
          .attr('x', pumpedOffset + yWidth / 2)
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('class', 'segment-text-cf')
          .attr('fill', '#fff')
          .text(y)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(1500)
          .attr('opacity', 0.7);
      }
    }
  };

  if (!segments || !testString) {
    return (
      <section className="visualization-canvas empty">
        <div className="empty-state">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="empty-icon">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="empty-message">Generate a test string and decompose it to see the visualization.</p>
          <p className="empty-hint">The visualization will show how the string is split and pumped.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="visualization-canvas">
      <div className="viz-header">
        <h2>Visual Representation</h2>
        <div className="viz-info">
          <span className="info-badge">
            {mode === 'regular' ? 'Regular Pumping Lemma' : 'Context-Free Pumping Lemma'}
          </span>
          {pumpCount > 1 && (
            <span className="pump-info">
              Pumping {mode === 'regular' ? 'y' : 'v & x'} × {pumpCount}
            </span>
          )}
        </div>
      </div>
      <svg ref={svgRef} className="viz-svg" />
      {hoveredSegment && (
        <div className="segment-tooltip">
          Segment: <strong>{hoveredSegment}</strong>
        </div>
      )}
    </section>
  );
}
