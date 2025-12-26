import React from 'react';
import { Svg, Path, G, Circle, Line } from '@alexandernanberg/react-pdf-renderer';

interface OrnamentProps {
  color: string;
  size?: number;
}

interface CornerOrnamentProps extends OrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Ornamento de esquina para estilo clásico
export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  color,
  position,
  size = 40,
}) => {
  const transforms: Record<string, string> = {
    'top-left': '',
    'top-right': `rotate(90, ${size / 2}, ${size / 2})`,
    'bottom-right': `rotate(180, ${size / 2}, ${size / 2})`,
    'bottom-left': `rotate(270, ${size / 2}, ${size / 2})`,
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={transforms[position]}>
        <Path
          d={`M 0 ${size * 0.4} Q 0 0 ${size * 0.4} 0`}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <Path
          d={`M 0 ${size * 0.6} Q 0 0 ${size * 0.6} 0`}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={0.5}
        />
      </G>
    </Svg>
  );
};

interface FlourishCornerProps extends OrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Flourish para esquinas creativas
export const FlourishCorner: React.FC<FlourishCornerProps> = ({
  color,
  position,
  size = 60,
}) => {
  const transforms: Record<string, string> = {
    'top-left': '',
    'top-right': `scale(-1, 1) translate(-${size}, 0)`,
    'bottom-right': `scale(-1, -1) translate(-${size}, -${size})`,
    'bottom-left': `scale(1, -1) translate(0, -${size})`,
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={transforms[position]}>
        <Path
          d={`M 5 ${size * 0.8} Q 5 5 ${size * 0.5} 5 T ${size * 0.9} ${size * 0.3}`}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <Circle cx={size * 0.15} cy={size * 0.85} r={3} fill={color} />
        <Circle cx={size * 0.9} cy={size * 0.25} r={2} fill={color} />
      </G>
    </Svg>
  );
};

interface SubtleGridPatternProps {
  color: string;
  opacity: number;
  width: number;
  height: number;
}

// Patrón de fondo sutil
export const SubtleGridPattern: React.FC<SubtleGridPatternProps> = ({
  color,
  opacity,
  width,
  height,
}) => {
  const gridSize = 20;
  const lines: React.ReactNode[] = [];

  // Líneas verticales
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={color}
        strokeWidth={0.5}
        opacity={opacity}
      />
    );
  }

  // Líneas horizontales
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={color}
        strokeWidth={0.5}
        opacity={opacity}
      />
    );
  }

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      {lines}
    </Svg>
  );
};
