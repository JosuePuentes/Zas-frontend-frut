'use client';

import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  gradient?: string;
}

export default function AnimatedCard({
  children,
  delay = 0,
  className = '',
  gradient = 'from-frutal-mango to-frutal-naranja',
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-xl text-white ${className}`}
    >
      {children}
    </motion.div>
  );
}
