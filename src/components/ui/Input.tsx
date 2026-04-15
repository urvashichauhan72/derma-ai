import { motion } from 'framer-motion';
import { useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value !== undefined && props.value !== '';

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(107,122,94,0.25), 0 2px 8px rgba(107,122,94,0.08)'
            : error
            ? '0 0 0 2px rgba(220,80,80,0.25)'
            : '0 1px 3px rgba(31,31,31,0.04)',
        }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl bg-white"
      >
        <input
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className="w-full px-5 pt-6 pb-2 rounded-2xl text-charcoal bg-transparent outline-none text-sm peer"
          placeholder=" "
        />
        <label
          className={`absolute left-5 transition-all duration-300 pointer-events-none ${
            focused || hasValue
              ? 'top-2 text-xs text-olive font-medium'
              : 'top-4 text-sm text-charcoal-muted'
          }`}
        >
          {label}
        </label>
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1 ml-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
