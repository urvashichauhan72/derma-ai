import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useStore } from '../lib/store';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';

const analysisTypes = [
  {
    id: 'mens-skincare',
    title: "Men's Skincare",
    description: 'Comprehensive skin analysis tailored for men\'s unique needs.',
    icon: '🧔',
    gradient: 'from-charcoal/6 to-charcoal/2',
    accent: 'bg-charcoal/8',
  },
  {
    id: 'womens-skincare',
    title: "Women's Skincare",
    description: 'Personalized routines for every skin type and concern.',
    icon: '✨',
    gradient: 'from-peach/15 to-peach/3',
    accent: 'bg-peach/20',
  },
  {
    id: 'diet',
    title: 'Diet Planning',
    description: 'Nutrition plans that nourish your skin from within.',
    icon: '🥗',
    gradient: 'from-olive/10 to-olive/2',
    accent: 'bg-olive/12',
  },
  {
    id: 'derma-chat',
    title: 'AI Derma Specialist',
    description: 'Chat with an AI dermatologist for instant skin advice.',
    icon: '🩺',
    gradient: 'from-olive/12 to-peach/8',
    accent: 'bg-olive/10',
  },
];

export default function Dashboard() {
  const { user, setCurrentAnalysisType, clearAnalysisAnswers } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStartAnalysis = (type: string) => {
    if (type === 'derma-chat') {
      navigate('/derma-chat');
      return;
    }
    setCurrentAnalysisType(type);
    clearAnalysisAnswers();
    navigate('/analysis');
  };

  return (
    <PageTransition className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Hello, {user?.name || 'there'}
          </h1>
          <p className="text-charcoal-muted">
            What would you like to explore today?
          </p>
        </motion.div>

        {/* Analysis Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="card" className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {analysisTypes.map((type, i) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  hoverable
                  glass
                  padding="lg"
                  className="h-full cursor-pointer group relative overflow-hidden"
                  onClick={() => handleStartAnalysis(type.id)}
                >
                  {/* Background accent */}
                  <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${type.gradient} blur-2xl transition-transform duration-700 group-hover:scale-[2]`} />

                  <div className="relative">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl ${type.accent} flex items-center justify-center text-2xl mb-6`}
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {type.icon}
                    </motion.div>

                    <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                      {type.description}
                    </p>

                    <div className="flex items-center gap-2 text-olive text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      {type.id === 'derma-chat' ? 'Start Chat' : 'Start Analysis'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="font-display text-xl font-semibold text-charcoal mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card
              glass
              hoverable
              padding="sm"
              className="cursor-pointer"
              onClick={() => navigate('/history')}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center">
                  <Clock className="w-5 h-5 text-charcoal-muted" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">View History</h4>
                  <p className="text-xs text-charcoal-muted">See your past analyses</p>
                </div>
              </div>
            </Card>
            <Card
              glass
              hoverable
              padding="sm"
              className="cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-olive/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-olive" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">Update Profile</h4>
                  <p className="text-xs text-charcoal-muted">Edit your preferences</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
