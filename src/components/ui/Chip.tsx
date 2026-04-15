import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
}

export default function Chip({ label, selected = false, onClick, icon }: ChipProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: selected ? 1.05 : 1,
        boxShadow: selected
          ? '0 0 0 2px rgba(107,122,94,0.4), 0 4px 12px rgba(107,122,94,0.12)'
          : '0 1px 3px rgba(31,31,31,0.04)',
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-colors duration-300 cursor-pointer select-none ${
        selected
          ? 'bg-olive text-white'
          : 'bg-white text-charcoal hover:bg-sand/50'
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </motion.button>
  );
}
