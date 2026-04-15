import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Chip from '../components/ui/Chip';
import Skeleton from '../components/ui/Skeleton';
import { useStore } from '../lib/store';
import { getAnalysisHistory } from '../lib/api';

import { Calendar, ArrowRight } from 'lucide-react';

const typeLabels: Record<string, string> = {
  'mens-skincare': "Men's Skincare",
  'womens-skincare': "Women's Skincare",
  diet: 'Diet Plan',
};

const typeIcons: Record<string, string> = {
  'mens-skincare': '🧔',
  'womens-skincare': '✨',
  diet: '🥗',
};

export default function History() {
  const { setHistory, history } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const data = await getAnalysisHistory();
      setHistory(data);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? history : history.filter((h) => h.type === filter);

  return (
    <PageTransition className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            Analysis History
          </h1>
          <p className="text-charcoal-muted text-sm">Review your past analyses and track progress.</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { label: 'All', value: 'all' },
            { label: "Women's Skincare", value: 'womens-skincare' },
            { label: "Men's Skincare", value: 'mens-skincare' },
            { label: 'Diet', value: 'diet' },
          ].map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              selected={filter === f.value}
              onClick={() => setFilter(f.value)}
            />
          ))}
        </motion.div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card glass className="text-center py-12">
            <p className="text-charcoal-muted">No analyses found.</p>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-sand hidden md:block" />

            <div className="space-y-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Card
                    hoverable
                    glass
                    className="cursor-pointer group md:ml-12"
                    onClick={() => navigate('/results')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sand/60 flex items-center justify-center text-lg flex-shrink-0">
                        {typeIcons[item.type] || '📊'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-olive">
                            {typeLabels[item.type] || item.type}
                          </span>
                          <span className="text-xs text-charcoal-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-bold text-charcoal">{item.score}</div>
                          <div className="text-xs text-charcoal-muted">score</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-olive transition-colors" />
                      </div>
                    </div>
                  </Card>

                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-[18px] w-3 h-3 rounded-full bg-olive/30 border-2 border-cream" style={{ marginTop: '-38px' }} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
