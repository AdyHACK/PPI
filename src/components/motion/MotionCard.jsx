import React from 'react';
import { motion } from 'framer-motion';

/**
 * MotionCard: High-performance scientific card with soft botanical elevation,
 * subtle border color transition, and smooth hover feedback.
 */
export default function MotionCard({
  children,
  className = '',
  onClick,
  interactive = false,
  delay = 0,
  ...props
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.35,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const hoverAnimation = interactive ? {
    y: -3,
    boxShadow: '0 10px 28px -4px rgba(35, 71, 55, 0.08), 0 2px 8px -1px rgba(35, 71, 55, 0.03)',
    borderColor: '#91A88F',
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
  } : undefined;

  const tapAnimation = interactive ? {
    scale: 0.992,
    transition: { duration: 0.1 }
  } : undefined;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2E8DF] p-5 shadow-subtle ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
