import React from 'react';
import { motion } from 'framer-motion';

/**
 * BotanicalBackground: Soft botanical ambient elements featuring animated gentle sage glows,
 * delicate leaf vein motifs, and subtle layered depth.
 */
export function BotanicalBackdrop({ variant = 'hero', className = '', children }) {
  if (variant === 'hero') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Soft Animated Sage & Teal Glows */}
        <motion.div 
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -15, 10, 0],
            scale: [1, 1.06, 0.96, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#91A88F]/12 blur-3xl pointer-events-none" 
        />

        <motion.div 
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.95, 1.05, 1]
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-[#6B9B8B]/10 blur-3xl pointer-events-none" 
        />

        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#A8B393]/10 blur-2xl pointer-events-none" />

        {/* Fine Leaf Vein & Botanical Silhouette Line SVGs */}
        <svg 
          viewBox="0 0 800 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -right-10 -bottom-10 w-[550px] h-[450px] text-[#234737] opacity-[0.035] pointer-events-none select-none"
        >
          {/* Main stem / vine curve */}
          <path d="M 100 600 C 250 500, 450 350, 750 100" stroke="currentColor" strokeWidth="3" />
          <path d="M 300 480 C 400 420, 520 400, 680 430" stroke="currentColor" strokeWidth="1.8" />
          <path d="M 420 380 C 500 280, 600 240, 720 220" stroke="currentColor" strokeWidth="1.8" />
          <path d="M 220 540 C 260 480, 320 440, 400 430" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Delicate leaf silhouettes along the curve */}
          <path d="M 420 380 C 460 320, 530 330, 520 380 C 510 420, 440 410, 420 380 Z" fill="currentColor" opacity="0.6" />
          <path d="M 550 270 C 600 220, 670 240, 650 290 C 630 330, 570 310, 550 270 Z" fill="currentColor" opacity="0.6" />
          <path d="M 300 480 C 330 430, 390 440, 380 490 C 370 520, 310 510, 300 480 Z" fill="currentColor" opacity="0.5" />
        </svg>

        {children}
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <motion.div 
          animate={{ opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#91A88F]/10 blur-2xl pointer-events-none" 
        />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#6B9B8B]/8 blur-2xl pointer-events-none" />
        
        {/* Subtle organic botanical branch border */}
        <svg
          viewBox="0 0 600 200"
          fill="none"
          className="absolute -top-12 -left-12 w-64 h-32 text-[#234737] opacity-[0.03] pointer-events-none"
        >
          <path d="M 10 180 C 120 160, 240 100, 400 40" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 120 150 C 160 110, 220 110, 210 160 Z" fill="currentColor" />
          <path d="M 240 100 C 290 60, 350 70, 340 120 Z" fill="currentColor" />
        </svg>

        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

export default BotanicalBackdrop;
