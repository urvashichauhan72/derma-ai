import { motion } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  hoverable = false,
  glass = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <motion.div
      whileHover={
        hoverable
          ? {
              scale: 1.03,
              boxShadow:
                '0 20px 50px rgba(31,31,31,0.1), 0 0 0 1px rgba(107,122,94,0.12)',
            }
          : undefined
      }
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl ${
        glass ? 'glass' : 'bg-white'
      } shadow-md ${paddings[padding]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
