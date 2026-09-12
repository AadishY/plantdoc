import React from 'react';
import { motion } from 'framer-motion';

interface DoodleProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

/**
 * 🌿 Hand-Drawn Lost Potted Plant Doodle
 * A charming hand-sketched little potted sprout with curious eyes, wavy leafy shoots,
 * sketched soil marks, and floating garden stars.
 */
export const DoodleLostPlant: React.FC<DoodleProps> = ({ 
  className = "w-48 h-48", 
  size, 
  animate = true 
}) => {
  return (
    <motion.svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      initial={animate ? { scale: 0.92, rotate: -2 } : undefined}
      animate={animate ? { scale: [0.95, 1.02, 0.95], rotate: [-2, 2, -2] } : undefined}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        {/* Organic Hand-Drawn Filter Effect */}
        <filter id="sketch-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2DD4BF" floodOpacity="0.4" />
        </filter>
        <linearGradient id="doodleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="50%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Floating Hand-Drawn Sparkles & Pollen Doodles */}
      <g stroke="#5EEAD4" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        {/* Top-left star */}
        <path d="M 40 45 Q 48 48 55 45 Q 52 52 55 60 Q 48 56 40 60 Q 44 52 40 45 Z" />
        {/* Top-right small star */}
        <path d="M 190 35 L 195 45 L 205 48 L 196 54 L 198 65 L 190 58 L 182 65 L 184 54 L 175 48 L 185 45 Z" fill="#2DD4BF" fillOpacity="0.3" />
        {/* Little floaty bubbles */}
        <circle cx="35" cy="110" r="4" fill="#2DD4BF" fillOpacity="0.4" />
        <circle cx="210" cy="120" r="5" fill="#5EEAD4" fillOpacity="0.3" />
        <circle cx="185" cy="90" r="3" fill="#10B981" fillOpacity="0.5" />
      </g>

      {/* Hand-Drawn Curious Eyebrows / Question Mark Doodle above plant */}
      <g stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 112 35 C 112 25, 128 20, 134 30 C 138 38, 126 44, 125 52" strokeDasharray="1 1" />
        <circle cx="125" cy="60" r="2.5" fill="#5EEAD4" />
      </g>

      {/* Foliage Leaf 1: Left Main Wavy Leaf */}
      <path
        d="M 115 110 C 85 95, 55 90, 50 65 C 75 62, 95 80, 115 105"
        fill="#2DD4BF"
        fillOpacity="0.25"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sketch-glow)"
      />
      {/* Vein Left Leaf */}
      <path d="M 60 72 C 78 82, 95 95, 114 107" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />

      {/* Foliage Leaf 2: Right Top Leaf */}
      <path
        d="M 125 105 C 145 80, 175 70, 190 75 C 185 100, 160 112, 125 112"
        fill="#10B981"
        fillOpacity="0.25"
        stroke="#2DD4BF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sketch-glow)"
      />
      {/* Vein Right Leaf */}
      <path d="M 175 80 C 160 92, 142 102, 126 108" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />

      {/* Foliage Leaf 3: Center Sprout / Crown */}
      <path
        d="M 120 105 C 110 75, 115 50, 122 45 C 130 50, 132 75, 120 105"
        fill="#34D399"
        fillOpacity="0.3"
        stroke="#5EEAD4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Plant Central Stem */}
      <path
        d="M 120 105 C 119 118, 121 128, 120 135"
        stroke="#2DD4BF"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Terracotta Potted Planter Rim (Hand-sketched wavy imperfect ellipse) */}
      <path
        d="M 75 135 C 75 130, 165 130, 165 135 C 165 142, 75 142, 75 135 Z"
        fill="#0a1811"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Soil Hatching in Rim */}
      <path d="M 85 135 Q 95 138 105 135 M 115 135 Q 125 138 135 135 M 145 135 Q 152 138 158 135" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

      {/* Main Pot Body (Tapered doodle bucket) */}
      <path
        d="M 82 140 L 92 195 C 93 202, 147 202, 148 195 L 158 140"
        fill="url(#doodleGrad)"
        fillOpacity="0.15"
        stroke="#2DD4BF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pot Cute Face Expressions: Eyes & Smile */}
      <g stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round">
        {/* Left eye blinking/happy arc */}
        <path d="M 104 165 C 104 160, 112 160, 112 165" />
        <circle cx="108" cy="164" r="1.5" fill="#5EEAD4" />
        {/* Right eye */}
        <path d="M 128 165 C 128 160, 136 160, 136 165" />
        <circle cx="132" cy="164" r="1.5" fill="#5EEAD4" />
        {/* Cute blush cheeks */}
        <circle cx="98" cy="172" r="3.5" fill="#F43F5E" fillOpacity="0.4" stroke="none" />
        <circle cx="142" cy="172" r="3.5" fill="#F43F5E" fillOpacity="0.4" stroke="none" />
        {/* Happy smiling mouth */}
        <path d="M 115 174 Q 120 180 125 174" fill="none" />
      </g>

      {/* Pot Decorative Hand-Drawn Sketch Ribbons / Tribal Hatching */}
      <path d="M 96 188 Q 120 192 144 188" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />

      {/* Wandering Footprints / Lost Map Dotted Trail underneath */}
      <g stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.6">
        <path d="M 45 210 Q 75 220 120 215 Q 165 210 195 220" />
      </g>
      <circle cx="195" cy="220" r="3" fill="#2DD4BF" />
      <circle cx="45" cy="210" r="3" fill="#2DD4BF" />
    </motion.svg>
  );
};

/**
 * 🔍 Hand-Drawn Magnifier & Foliar Sprout Doodle
 */
export const DoodleMagnifierSprout: React.FC<DoodleProps> = ({ 
  className = "w-40 h-40", 
  size,
  animate = true 
}) => {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      initial={animate ? { rotate: -5 } : undefined}
      animate={animate ? { rotate: [-5, 5, -5] } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Magnifier Glass Rim */}
      <circle
        cx="90"
        cy="85"
        r="55"
        fill="#2DD4BF"
        fillOpacity="0.12"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Glass Inner Reflection Arc */}
      <path
        d="M 60 60 C 70 45, 95 45, 115 55"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Magnifier Handle */}
      <path
        d="M 132 125 L 175 168 C 180 173, 173 180, 168 175 L 125 132"
        fill="#10B981"
        fillOpacity="0.3"
        stroke="#2DD4BF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle Grip Stripes */}
      <line x1="145" y1="145" x2="155" y2="135" stroke="#5EEAD4" strokeWidth="2" />
      <line x1="155" y1="155" x2="165" y2="145" stroke="#5EEAD4" strokeWidth="2" />

      {/* Happy Little Sprout Inside Lens */}
      <path
        d="M 90 115 C 88 100, 92 88, 90 75"
        stroke="#2DD4BF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Left Tiny Leaf */}
      <path
        d="M 90 92 C 72 85, 68 70, 75 62 C 85 64, 88 78, 90 92"
        fill="#34D399"
        fillOpacity="0.4"
        stroke="#5EEAD4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Right Tiny Leaf */}
      <path
        d="M 90 85 C 105 78, 112 65, 108 58 C 98 58, 92 72, 90 85"
        fill="#10B981"
        fillOpacity="0.4"
        stroke="#2DD4BF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Floating Doodle Dots & Crosses */}
      <path d="M 35 45 L 45 45 M 40 40 L 40 50" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />
      <path d="M 160 50 L 170 50 M 165 45 L 165 55" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="130" r="3" fill="#10B981" />
      <circle cx="160" cy="110" r="2.5" fill="#5EEAD4" />
    </motion.svg>
  );
};

/**
 * ☀️ Hand-Drawn Sunny Cloud & Garden Weather Doodle
 */
export const DoodleSunnyCloud: React.FC<DoodleProps> = ({ 
  className = "w-40 h-40", 
  size,
  animate = true 
}) => {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      initial={animate ? { y: 0 } : undefined}
      animate={animate ? { y: [-4, 4, -4] } : undefined}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Sun Body emerging from top-left */}
      <circle
        cx="75"
        cy="75"
        r="32"
        fill="#FBBF24"
        fillOpacity="0.25"
        stroke="#FBBF24"
        strokeWidth="3"
      />
      {/* Sun Beams */}
      <g stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round">
        <line x1="75" y1="32" x2="75" y2="20" />
        <line x1="45" y1="45" x2="35" y2="35" />
        <line x1="32" y1="75" x2="20" y2="75" />
        <line x1="110" y1="50" x2="120" y2="40" />
      </g>

      {/* Fluffy Sketched Cloud in front */}
      <path
        d="M 60 135 C 45 135, 40 115, 52 105 C 50 90, 70 80, 85 88 C 98 75, 125 78, 132 92 C 145 92, 155 105, 150 118 C 160 128, 150 140, 138 138 L 60 138 Z"
        fill="#0d1b14"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cloud Cute Face */}
      <circle cx="85" cy="115" r="2" fill="#5EEAD4" />
      <circle cx="115" cy="115" r="2" fill="#5EEAD4" />
      <path d="M 97 122 Q 100 126 103 122" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />

      {/* Rain Drops with Leaf Tail */}
      <g stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3">
        <line x1="70" y1="150" x2="65" y2="165" />
        <line x1="100" y1="150" x2="95" y2="170" />
        <line x1="130" y1="150" x2="125" y2="165" />
      </g>
    </motion.svg>
  );
};

/**
 * 🚿 Hand-Drawn Watering Can Doodle
 */
export const DoodleWateringCan: React.FC<DoodleProps> = ({ 
  className = "w-40 h-40", 
  size,
  animate = true 
}) => {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      initial={animate ? { rotate: -3 } : undefined}
      animate={animate ? { rotate: [-3, 6, -3] } : undefined}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Can Body */}
      <path
        d="M 65 95 L 75 155 C 76 160, 134 160, 135 155 L 145 95 Z"
        fill="#2DD4BF"
        fillOpacity="0.2"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Can Spout */}
      <path
        d="M 135 125 L 165 95 L 168 85 L 160 85 L 130 110"
        fill="#10B981"
        fillOpacity="0.25"
        stroke="#2DD4BF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spout Rose Head */}
      <ellipse cx="170" cy="85" rx="6" ry="12" fill="#0c1e15" stroke="#5EEAD4" strokeWidth="2.5" />
      
      {/* Sprinkling Water Droplets */}
      <g stroke="#34D399" strokeWidth="2" strokeLinecap="round">
        <path d="M 180 82 Q 188 85 186 92" />
        <path d="M 182 92 Q 192 98 188 106" />
        <path d="M 178 102 Q 186 112 180 120" />
      </g>

      {/* Can Handle Arc */}
      <path
        d="M 75 95 C 40 95, 40 155, 75 155"
        stroke="#5EEAD4"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Top Carry Handle */}
      <path
        d="M 85 95 C 85 70, 125 70, 125 95"
        stroke="#2DD4BF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
};
