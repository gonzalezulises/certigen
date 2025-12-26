import React from 'react';
import { Svg, Path, Line, Circle, Rect } from '@alexandernanberg/react-pdf-renderer';

interface DividerProps {
  color: string;
  width: number;
}

// Divisor simple
export const SimpleDivider: React.FC<DividerProps> = ({ color, width }) => (
  <Svg width={width} height={10} viewBox={`0 0 ${width} 10`}>
    <Line x1={0} y1={5} x2={width} y2={5} stroke={color} strokeWidth={1} />
  </Svg>
);

// Divisor ornamentado
export const OrnateDivider: React.FC<DividerProps> = ({ color, width }) => (
  <Svg width={width} height={20} viewBox={`0 0 ${width} 20`}>
    {/* Líneas laterales */}
    <Line x1={0} y1={10} x2={width * 0.35} y2={10} stroke={color} strokeWidth={1} />
    <Line x1={width * 0.65} y1={10} x2={width} y2={10} stroke={color} strokeWidth={1} />

    {/* Elemento central decorativo */}
    <Circle cx={width / 2 - 15} cy={10} r={2} fill={color} />
    <Circle cx={width / 2 + 15} cy={10} r={2} fill={color} />

    {/* Diamante central */}
    <Path
      d={`M ${width / 2} 4 L ${width / 2 + 6} 10 L ${width / 2} 16 L ${width / 2 - 6} 10 Z`}
      fill={color}
    />
  </Svg>
);

// Divisor con puntos
export const DottedDivider: React.FC<DividerProps> = ({ color, width }) => {
  const dots: React.ReactNode[] = [];
  const dotCount = Math.floor(width / 15);
  const spacing = width / (dotCount + 1);

  for (let i = 1; i <= dotCount; i++) {
    dots.push(
      <Circle
        key={i}
        cx={spacing * i}
        cy={5}
        r={i === Math.ceil(dotCount / 2) ? 3 : 2}
        fill={color}
        opacity={i === Math.ceil(dotCount / 2) ? 1 : 0.6}
      />
    );
  }

  return (
    <Svg width={width} height={10} viewBox={`0 0 ${width} 10`}>
      {dots}
    </Svg>
  );
};

interface GradientDividerProps extends DividerProps {
  secondaryColor: string;
}

// Divisor con gradiente (simulado)
export const GradientDivider: React.FC<GradientDividerProps> = ({
  color,
  secondaryColor,
  width,
}) => (
  <Svg width={width} height={6} viewBox={`0 0 ${width} 6`}>
    <Rect x={0} y={2} width={width * 0.25} height={2} fill={color} opacity={0.3} />
    <Rect x={width * 0.25} y={2} width={width * 0.25} height={2} fill={color} opacity={0.6} />
    <Rect x={width * 0.5} y={2} width={width * 0.25} height={2} fill={secondaryColor} opacity={0.6} />
    <Rect x={width * 0.75} y={2} width={width * 0.25} height={2} fill={secondaryColor} opacity={0.3} />
  </Svg>
);

interface DividerSelectorProps {
  style: 'none' | 'simple' | 'ornate' | 'dots' | 'gradient';
  color: string;
  secondaryColor?: string;
  width?: number;
}

// Exportar componente que selecciona el divisor correcto
export const Divider: React.FC<DividerSelectorProps> = ({
  style,
  color,
  secondaryColor = color,
  width = 200,
}) => {
  switch (style) {
    case 'simple':
      return <SimpleDivider color={color} width={width} />;
    case 'ornate':
      return <OrnateDivider color={color} width={width} />;
    case 'dots':
      return <DottedDivider color={color} width={width} />;
    case 'gradient':
      return <GradientDivider color={color} secondaryColor={secondaryColor} width={width} />;
    default:
      return null;
  }
};
