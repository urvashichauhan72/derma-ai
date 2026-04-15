interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'circle';
}

export default function Skeleton({ className = '', lines = 1, variant = 'text' }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`rounded-3xl bg-sand/40 skeleton-pulse ${className}`} />
    );
  }
  if (variant === 'circle') {
    return (
      <div className={`rounded-full bg-sand/40 skeleton-pulse ${className}`} />
    );
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-sand/40 skeleton-pulse"
          style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%', animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
