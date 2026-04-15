import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import { useStore } from '../lib/store';
import { submitAnalysis } from '../lib/api';

const messages = [
  'Initializing AI analysis engine...',
  'Scanning your skin profile data...',
  'Evaluating environmental factors...',
  'Cross-referencing dermatological database...',
  'Generating personalized recommendations...',
  'Optimizing your routine...',
  'Finalizing your report...',
];

export default function Processing() {
  const navigate = useNavigate();
  const { currentAnalysisType, analysisAnswers, setCurrentResult } = useStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const nodesRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  // Animate neural network nodes
  useEffect(() => {
    if (!nodesRef.current) return;
    const nodes = nodesRef.current.querySelectorAll('.node');
    nodes.forEach((node, i) => {
      gsap.to(node, {
        scale: 'random(0.6, 1.4)',
        opacity: 'random(0.3, 1)',
        duration: 1.5 + i * 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
      });
    });

    const lines = nodesRef.current.querySelectorAll('.line');
    lines.forEach((line, i) => {
      gsap.to(line, {
        opacity: 'random(0.1, 0.6)',
        duration: 2 + i * 0.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      });
    });
  }, []);

  // Animate scanning rings
  useEffect(() => {
    if (!ringsRef.current) return;
    const rings = ringsRef.current.querySelectorAll('.ring');
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        rotation: i % 2 === 0 ? 360 : -360,
        duration: 8 + i * 4,
        ease: 'none',
        repeat: -1,
      });
    });
  }, []);

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Submit analysis
  useEffect(() => {
    const run = async () => {
      try {
        const result = await submitAnalysis(currentAnalysisType, analysisAnswers);
        setCurrentResult(result);
        navigate('/results');
      } catch {
        navigate('/dashboard');
      }
    };
    run();
  }, []);

  return (
    <PageTransition className="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Animated visual */}
        <div className="relative w-64 h-64 mx-auto mb-12">
          {/* Scanning rings */}
          <div ref={ringsRef} className="absolute inset-0">
            <div className="ring absolute inset-0 rounded-full border border-olive/15" />
            <div className="ring absolute inset-4 rounded-full border border-peach/20" style={{ borderStyle: 'dashed' }} />
            <div className="ring absolute inset-10 rounded-full border border-olive/10" />
          </div>

          {/* Central glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-16 rounded-full bg-gradient-to-br from-olive/25 to-peach/20 blur-xl"
          />

          {/* Center icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <span className="text-3xl">🧬</span>
            </div>
          </motion.div>

          {/* Neural network nodes */}
          <div ref={nodesRef} className="absolute inset-0">
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = 100;
              const x = 128 + Math.cos(angle) * r;
              const y = 128 + Math.sin(angle) * r;
              return (
                <div key={i}>
                  <div
                    className="node absolute w-3 h-3 rounded-full bg-olive/40"
                    style={{ left: x - 6, top: y - 6 }}
                  />
                  <div
                    className="line absolute h-px bg-olive/15 origin-left"
                    style={{
                      left: 128,
                      top: 128,
                      width: r,
                      transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Scan lines */}
          <motion.div
            animate={{ y: [-128, 128] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-olive/30 to-transparent"
            style={{ top: '50%' }}
          />
        </div>

        {/* Message */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <p className="text-sm text-charcoal-muted font-medium">
            {messages[messageIndex]}
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-olive/50"
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
