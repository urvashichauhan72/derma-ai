import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const blobs = containerRef.current.querySelectorAll('.blob');

    blobs.forEach((blob, i) => {
      const duration = 18 + i * 4;
      const xRange = 60 + i * 20;
      const yRange = 40 + i * 15;

      gsap.to(blob, {
        x: `random(-${xRange}, ${xRange})`,
        y: `random(-${yRange}, ${yRange})`,
        scale: `random(0.8, 1.2)`,
        rotation: `random(-20, 20)`,
        duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 2,
      });
    });

    // Subtle particle layer
    const particles = containerRef.current.querySelectorAll('.particle');
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: `random(-100, 100)`,
        x: `random(-50, 50)`,
        opacity: `random(0.1, 0.5)`,
        duration: 10 + i * 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 1.5,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #F6F3EE 0%, #EDE8E0 30%, #F0E8DD 60%, #F6F3EE 100%)',
        }}
      />

      {/* Organic blobs */}
      <div
        className="blob absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          right: '-5%',
          background:
            'radial-gradient(circle, rgba(232,191,163,0.18) 0%, rgba(232,191,163,0.04) 70%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="blob absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: '-8%',
          left: '-3%',
          background:
            'radial-gradient(circle, rgba(107,122,94,0.12) 0%, rgba(107,122,94,0.03) 70%, transparent 100%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="blob absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '30%',
          background:
            'radial-gradient(circle, rgba(232,220,207,0.2) 0%, rgba(232,220,207,0.05) 70%, transparent 100%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="blob absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          top: '20%',
          right: '25%',
          background:
            'radial-gradient(circle, rgba(232,191,163,0.1) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />
      <div
        className="blob absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          bottom: '20%',
          right: '10%',
          background:
            'radial-gradient(circle, rgba(107,122,94,0.08) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Light reflection streaks */}
      <div
        className="blob absolute"
        style={{
          width: 800,
          height: 2,
          top: '30%',
          left: '-10%',
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transform: 'rotate(-8deg)',
          filter: 'blur(3px)',
        }}
      />
      <div
        className="blob absolute"
        style={{
          width: 600,
          height: 2,
          top: '65%',
          right: '-5%',
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'rotate(5deg)',
          filter: 'blur(2px)',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 11) % 90}%`,
            background:
              i % 2 === 0
                ? 'rgba(107,122,94,0.15)'
                : 'rgba(232,191,163,0.2)',
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}
