import React from 'react';
import { Svg, Path, Circle, G, Line } from '@react-pdf/renderer';

interface SealProps {
  primaryColor: string;
  accentColor: string;
  size?: number;
}

// Sello clásico con estrella
export const ClassicSeal: React.FC<SealProps> = ({
  primaryColor,
  accentColor,
  size = 80,
}) => {
  const scale = size / 80;

  const spikes: React.ReactNode[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const x1 = 40 + 32 * Math.cos(angle);
    const y1 = 40 + 32 * Math.sin(angle);
    const x2 = 40 + 38 * Math.cos(angle);
    const y2 = 40 + 38 * Math.sin(angle);
    spikes.push(
      <Line
        key={i}
        x1={x1 * scale}
        y1={y1 * scale}
        x2={x2 * scale}
        y2={y2 * scale}
        stroke={primaryColor}
        strokeWidth={2}
      />
    );
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Puntas exteriores */}
      {spikes}

      {/* Círculo exterior */}
      <Circle cx={40 * scale} cy={40 * scale} r={30 * scale} stroke={primaryColor} strokeWidth={2} fill="none" />

      {/* Círculo interior */}
      <Circle cx={40 * scale} cy={40 * scale} r={24 * scale} stroke={primaryColor} strokeWidth={1} fill="none" />

      {/* Estrella central */}
      <Path
        d={`M ${40 * scale} ${25 * scale} L ${44 * scale} ${36 * scale} L ${55 * scale} ${38 * scale} L ${47 * scale} ${46 * scale} L ${49 * scale} ${57 * scale} L ${40 * scale} ${51 * scale} L ${31 * scale} ${57 * scale} L ${33 * scale} ${46 * scale} L ${25 * scale} ${38 * scale} L ${36 * scale} ${36 * scale} Z`}
        fill={accentColor}
      />
    </Svg>
  );
};

// Sello moderno minimalista
export const ModernSeal: React.FC<SealProps> = ({
  primaryColor,
  accentColor,
  size = 80,
}) => (
  <Svg width={size} height={size} viewBox="0 0 80 80">
    {/* Círculo exterior */}
    <Circle cx={40} cy={40} r={35} stroke={primaryColor} strokeWidth={3} fill="none" />

    {/* Círculo interior */}
    <Circle cx={40} cy={40} r={28} stroke={primaryColor} strokeWidth={1} fill="none" />

    {/* Check mark */}
    <Path
      d="M 28 42 L 36 50 L 54 30"
      stroke={accentColor}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sello tipo ribbon/cinta
export const RibbonSeal: React.FC<SealProps> = ({
  primaryColor,
  accentColor,
  size = 100,
}) => (
  <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
    {/* Cuerpo del ribbon */}
    <Path
      d="M 10 30 L 50 15 L 90 30 L 90 50 L 50 65 L 10 50 Z"
      fill={primaryColor}
    />

    {/* Colas del ribbon */}
    <Path d="M 10 50 L 0 60 L 10 55 Z" fill={primaryColor} opacity={0.8} />
    <Path d="M 90 50 L 100 60 L 90 55 Z" fill={primaryColor} opacity={0.8} />

    {/* Decoración interior */}
    <Path
      d="M 20 32 L 50 20 L 80 32 L 80 48 L 50 60 L 20 48 Z"
      stroke={accentColor}
      strokeWidth={1}
      fill="none"
    />

    {/* Estrella pequeña */}
    <Path
      d="M 50 30 L 52 36 L 58 36 L 53 40 L 55 46 L 50 42 L 45 46 L 47 40 L 42 36 L 48 36 Z"
      fill={accentColor}
    />
  </Svg>
);

// Badge/Insignia
export const BadgeSeal: React.FC<SealProps> = ({
  primaryColor,
  accentColor,
  size = 80,
}) => (
  <Svg width={size} height={size} viewBox="0 0 80 80">
    {/* Hexágono exterior */}
    <Path
      d="M 40 5 L 70 20 L 70 55 L 40 75 L 10 55 L 10 20 Z"
      fill={primaryColor}
    />

    {/* Hexágono interior */}
    <Path
      d="M 40 12 L 62 24 L 62 52 L 40 68 L 18 52 L 18 24 Z"
      stroke={accentColor}
      strokeWidth={1}
      fill="none"
    />

    {/* Círculo central */}
    <Circle cx={40} cy={40} r={18} fill={accentColor} opacity={0.2} />
    <Circle cx={40} cy={40} r={18} stroke={accentColor} strokeWidth={1} fill="none" />

    {/* Ícono de verificación */}
    <Path
      d="M 30 42 L 37 49 L 52 32"
      stroke={accentColor}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface SealSelectorProps {
  style: 'classic' | 'modern' | 'ribbon' | 'badge';
  primaryColor: string;
  accentColor: string;
  size?: number;
}

// Exportar componente selector
export const Seal: React.FC<SealSelectorProps> = ({
  style,
  primaryColor,
  accentColor,
  size = 80,
}) => {
  const props = { primaryColor, accentColor, size };

  switch (style) {
    case 'classic':
      return <ClassicSeal {...props} />;
    case 'modern':
      return <ModernSeal {...props} />;
    case 'ribbon':
      return <RibbonSeal {...props} />;
    case 'badge':
      return <BadgeSeal {...props} />;
    default:
      return <ClassicSeal {...props} />;
  }
};
