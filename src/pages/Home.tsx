import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Sparkles, Salad, ArrowRight, Droplets } from 'lucide-react';

const heroWords = ['Your', 'Skin.', 'Your', 'Diet.', 'Perfected', 'by', 'AI.'];

export default function Home() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visualRef.current) return;
    const elements = visualRef.current.querySelectorAll('.float-element');
    elements.forEach((el, i) => {
      gsap.to(el, {
        y: `random(-20, 20)`,
        x: `random(-12, 12)`,
        rotation: `random(-8, 8)`,
        duration: 4 + i * 0.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
      });
    });
  }, []);

  return (
    <PageTransition className="relative z-10">
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive/8 text-olive text-sm font-medium mb-8"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Skincare & Nutrition
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`inline-block mr-3 ${
                      word === 'AI.' ? 'text-olive' : 'text-charcoal'
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-lg text-charcoal-muted leading-relaxed max-w-md mb-10"
              >
                Discover personalized skincare routines and nutrition plans
                crafted by advanced AI, tailored to your unique profile.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/signup">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Begin Your Journey
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right - Animated Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              ref={visualRef}
              className="relative h-[480px] lg:h-[560px] hidden lg:block"
            >
              {/* Central serum bottle silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-72">
                  {/* Bottle body */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-52 rounded-3xl bg-gradient-to-b from-white/80 to-sand/60 shadow-lg border border-white/60" />
                  {/* Bottle neck */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-20 rounded-t-2xl bg-gradient-to-b from-olive/20 to-white/60" />
                  {/* Dropper */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-12 rounded-t-full bg-olive/30" />
                  {/* Drops */}
                  <motion.div
                    animate={{ y: [0, 80], opacity: [1, 0], scale: [1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeIn' }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full bg-gradient-to-b from-peach/60 to-peach/20"
                  />
                  <motion.div
                    animate={{ y: [0, 60], opacity: [1, 0], scale: [1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'easeIn', delay: 1 }}
                    className="absolute top-24 left-[45%] w-2 h-3 rounded-full bg-gradient-to-b from-olive/40 to-olive/10"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="float-element absolute top-8 left-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F4A460]/30 to-[#F4A460]/10 backdrop-blur-sm flex items-center justify-center text-3xl shadow-md border border-white/40">
                  🍊
                </div>
              </div>

              <div className="float-element absolute top-16 right-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-olive/20 to-olive/5 backdrop-blur-sm flex items-center justify-center text-2xl shadow-md border border-white/40">
                  🥑
                </div>
              </div>

              <div className="float-element absolute bottom-24 left-4">
                <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#90C695]/25 to-[#90C695]/8 backdrop-blur-sm flex items-center justify-center text-2xl shadow-md border border-white/40 p-4">
                  🥒
                </div>
              </div>

              <div className="float-element absolute bottom-16 right-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-peach/30 to-peach/10 backdrop-blur-sm flex items-center justify-center text-xl shadow-md border border-white/40">
                  🧂
                </div>
              </div>

              <div className="float-element absolute top-1/2 left-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/50">
                  <Droplets className="w-5 h-5 text-olive/50" />
                </div>
              </div>

              {/* Bubbles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="float-element absolute rounded-full bg-white/30 border border-white/40"
                  style={{
                    width: 8 + i * 4,
                    height: 8 + i * 4,
                    top: `${20 + (i * 13) % 60}%`,
                    left: `${15 + (i * 17) % 70}%`,
                  }}
                />
              ))}

              {/* Liquid ripple */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.05, 0.15] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full bg-peach/20 blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Intelligent Analysis
            </h2>
            <p className="text-charcoal-muted max-w-lg mx-auto">
              Three powerful AI modules designed to transform your wellness routine.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🧔',
                title: "Men's Skincare",
                desc: 'Tailored analysis for men\'s unique skin needs, from post-shave care to anti-aging.',
                color: 'from-charcoal/8 to-charcoal/2',
                iconBg: 'bg-charcoal/8',
              },
              {
                icon: '✨',
                title: "Women's Skincare",
                desc: 'Comprehensive skin assessment with personalized routines for every skin type.',
                color: 'from-peach/20 to-peach/5',
                iconBg: 'bg-peach/20',
              },
              {
                icon: <Salad className="w-6 h-6 text-olive" />,
                title: 'Diet Planning',
                desc: 'Nutrition plans that nourish your skin from within, backed by dermatological science.',
                color: 'from-olive/12 to-olive/3',
                iconBg: 'bg-olive/12',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Card hoverable glass className="h-full group cursor-pointer">
                  <div className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.color} blur-2xl transition-transform duration-500 group-hover:scale-150`} />
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center text-2xl mb-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-charcoal mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-charcoal-muted leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              How It Works
            </h2>
            <p className="text-charcoal-muted max-w-lg mx-auto">
              Three simple steps to your personalized wellness plan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tell Us About You', desc: 'Answer a few quick questions about your skin, lifestyle, and goals.' },
              { step: '02', title: 'AI Analyzes', desc: 'Our AI processes your profile to create a tailored analysis.' },
              { step: '03', title: 'Get Your Plan', desc: 'Receive personalized routines and recommendations instantly.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="font-display text-5xl font-bold text-olive/15 mb-4">{item.step}</div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <Card glass className="text-center py-16 px-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
                Start Your Skin Journey
              </h2>
              <p className="text-charcoal-muted max-w-md mx-auto mb-8">
                Join thousands discovering their perfect skincare and nutrition routines.
              </p>
              <Link to="/signup">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-sand/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-charcoal-muted text-sm">
            <div className="w-6 h-6 rounded-lg bg-olive flex items-center justify-center">
              <span className="text-white text-xs">✦</span>
            </div>
            Dermaïa © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6 text-sm text-charcoal-muted">
            <span className="hover:text-charcoal transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-charcoal transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-charcoal transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}
