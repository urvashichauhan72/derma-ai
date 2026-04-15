import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: string;
  className?: string;
}

export default function ProgressBar({ progress, label, color, className = '' }: ProgressBarProps) {
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-charcoal-muted">{label}</span>
          <span className="text-xs font-semibold text-charcoal">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-sand/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color || 'linear-gradient(90deg, #6B7A5E, #8A9A7A)' }}
        />
      </div>
    </div>
  );
}
