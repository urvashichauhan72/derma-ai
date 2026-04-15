import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { useRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Ripple
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    if (onClick && !disabled && !loading) onClick(e);
  };

  const base = 'ripple-container relative inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer select-none';

  const variants: Record<string, string> = {
    primary:
      'bg-olive text-white shadow-md hover:bg-olive-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-sand text-charcoal shadow-sm hover:bg-sand-dark hover:shadow-md hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-charcoal hover:bg-sand/50',
    outline:
      'bg-transparent border border-sand-dark text-charcoal hover:bg-sand/30 hover:border-olive/30',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      ref={btnRef}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : icon ? (
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
