import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Dropdown from '../components/ui/Dropdown';
import { useStore } from '../lib/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multi' | 'dropdown-pair' | 'slider' | 'dropdown';
  options?: { label: string; value: string; icon?: string }[];
  dropdowns?: { label: string; options: { value: string; label: string }[] }[];
  sliderConfig?: { min: number; max: number; step: number; unit: string };
}

const skincareQuestions: Question[] = [
  {
    id: 'concerns',
    title: 'What are your skin concerns?',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: [
      { label: 'Acne', value: 'acne', icon: '🔴' },
      { label: 'Dark Spots', value: 'dark-spots', icon: '🔵' },
      { label: 'Pigmentation', value: 'pigmentation', icon: '🟤' },
      { label: 'Oiliness', value: 'oiliness', icon: '💧' },
      { label: 'Dryness', value: 'dryness', icon: '🌵' },
      { label: 'Sensitivity', value: 'sensitivity', icon: '🌸' },
      { label: 'Fine Lines', value: 'fine-lines', icon: '〰️' },
      { label: 'Uneven Texture', value: 'texture', icon: '🧱' },
    ],
  },
  {
    id: 'routine',
    title: 'Current skincare routine?',
    subtitle: 'How many steps do you currently follow?',
    type: 'single',
    options: [
      { label: 'None', value: 'none', icon: '❌' },
      { label: 'Basic (1-2 steps)', value: 'basic', icon: '👌' },
      { label: 'Moderate (3-5 steps)', value: 'moderate', icon: '✅' },
      { label: 'Advanced (6+ steps)', value: 'advanced', icon: '🏆' },
    ],
  },
  {
    id: 'sunExposure',
    title: 'Daily sun exposure?',
    subtitle: 'How much time do you spend outdoors?',
    type: 'single',
    options: [
      { label: 'Minimal (< 30 min)', value: 'minimal', icon: '🌤️' },
      { label: 'Moderate (1-2 hrs)', value: 'moderate', icon: '☀️' },
      { label: 'High (3+ hrs)', value: 'high', icon: '🌞' },
    ],
  },
  {
    id: 'waterIntake',
    title: 'Daily water intake?',
    subtitle: 'Hydration is key for healthy skin',
    type: 'single',
    options: [
      { label: 'Less than 4 glasses', value: 'low', icon: '🥤' },
      { label: '4-6 glasses', value: 'moderate', icon: '💧' },
      { label: '7-8 glasses', value: 'good', icon: '💦' },
      { label: '8+ glasses', value: 'excellent', icon: '🌊' },
    ],
  },
  {
    id: 'sleep',
    title: 'Average sleep per night?',
    subtitle: 'Sleep affects skin regeneration',
    type: 'single',
    options: [
      { label: 'Less than 5 hrs', value: 'poor', icon: '😴' },
      { label: '5-6 hours', value: 'fair', icon: '😪' },
      { label: '7-8 hours', value: 'good', icon: '😌' },
      { label: '8+ hours', value: 'excellent', icon: '💆' },
    ],
  },
];

const dietQuestions: Question[] = [
  {
    id: 'gender',
    title: 'What is your gender?',
    subtitle: 'This helps us tailor nutritional advice',
    type: 'single',
    options: [
      { label: 'Male', value: 'Male', icon: '🧔' },
      { label: 'Female', value: 'Female', icon: '👩' },
    ],
  },
  {
    id: 'dietType',
    title: 'Dietary preference?',
    subtitle: 'Select your diet type',
    type: 'single',
    options: [
      { label: 'Vegetarian', value: 'Vegetarian', icon: '🥬' },
      { label: 'Non-Vegetarian', value: 'Non-Vegetarian', icon: '🍗' },
    ],
  },
  {
    id: 'height',
    title: 'What is your height?',
    subtitle: 'Select your height in feet and inches',
    type: 'dropdown-pair',
    dropdowns: [
      {
        label: 'Feet',
        options: [
          { value: '4', label: '4 ft' },
          { value: '5', label: '5 ft' },
          { value: '6', label: '6 ft' },
          { value: '7', label: '7 ft' },
        ],
      },
      {
        label: 'Inches',
        options: Array.from({ length: 12 }, (_, i) => ({
          value: String(i),
          label: `${i} in`,
        })),
      },
    ],
  },
  {
    id: 'weight',
    title: 'What is your weight?',
    subtitle: 'Select your weight range',
    type: 'dropdown',
    dropdowns: [
      {
        label: 'Weight (lbs)',
        options: [
          { value: '90-110', label: '90 – 110 lbs' },
          { value: '110-130', label: '110 – 130 lbs' },
          { value: '130-150', label: '130 – 150 lbs' },
          { value: '150-170', label: '150 – 170 lbs' },
          { value: '170-190', label: '170 – 190 lbs' },
          { value: '190-210', label: '190 – 210 lbs' },
          { value: '210-230', label: '210 – 230 lbs' },
          { value: '230+', label: '230+ lbs' },
        ],
      },
    ],
  },
  {
    id: 'activityLevel',
    title: 'Activity level?',
    subtitle: 'How active are you on a typical week?',
    type: 'single',
    options: [
      { label: 'Sedentary', value: 'sedentary', icon: '🛋️' },
      { label: 'Light (1-2 days)', value: 'light', icon: '🚶' },
      { label: 'Moderate (3-4 days)', value: 'moderate', icon: '🏃' },
      { label: 'Active (5+ days)', value: 'active', icon: '💪' },
    ],
  },
  {
    id: 'allergies',
    title: 'Any food allergies?',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: [
      { label: 'None', value: 'none', icon: '✅' },
      { label: 'Dairy', value: 'dairy', icon: '🧀' },
      { label: 'Gluten', value: 'gluten', icon: '🍞' },
      { label: 'Nuts', value: 'nuts', icon: '🥜' },
      { label: 'Shellfish', value: 'shellfish', icon: '🦐' },
      { label: 'Soy', value: 'soy', icon: '🌾' },
    ],
  },
  {
    id: 'goal',
    title: 'Primary nutrition goal?',
    subtitle: 'What do you want to achieve?',
    type: 'single',
    options: [
      { label: 'Clearer Skin', value: 'skin', icon: '✨' },
      { label: 'Weight Management', value: 'weight', icon: '⚖️' },
      { label: 'More Energy', value: 'energy', icon: '⚡' },
      { label: 'Better Digestion', value: 'digestion', icon: '🌿' },
      { label: 'Overall Health', value: 'health', icon: '❤️' },
    ],
  },
];

export default function Analysis() {
  const { currentAnalysisType, setAnalysisAnswer, analysisAnswers } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const isDiet = currentAnalysisType === 'diet';
  const questions = isDiet ? dietQuestions : skincareQuestions;
  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const currentValue = analysisAnswers[currentQ.id];

  const canProceed = () => {
    if (!currentValue) return false;
    if (currentQ.type === 'multi') return (currentValue as string[]).length > 0;
    if (currentQ.type === 'dropdown-pair') {
      const val = currentValue as Record<string, string>;
      return !!val?.feet && val?.inches !== undefined && val?.inches !== '';
    }

    return true;
  };

  const handleSingle = (value: string) => {
    setAnalysisAnswer(currentQ.id, value);
  };

  const handleMulti = (value: string) => {
    const current = (currentValue as string[]) || [];
    if (value === 'none') {
      setAnalysisAnswer(currentQ.id, ['none']);
      return;
    }
    const filtered = current.filter((v) => v !== 'none');
    if (filtered.includes(value)) {
      setAnalysisAnswer(currentQ.id, filtered.filter((v) => v !== value));
    } else {
      setAnalysisAnswer(currentQ.id, [...filtered, value]);
    }
  };

  const handleDropdownPair = (key: string, value: string) => {
    const current = (currentValue as Record<string, string>) || {};
    setAnalysisAnswer(currentQ.id, { ...current, [key]: value });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/processing');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate('/dashboard');
  };

  const typeLabel = isDiet ? 'Diet Analysis' : currentAnalysisType === 'mens-skincare' ? "Men's Skincare Analysis" : "Women's Skincare Analysis";

  return (
    <PageTransition className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-4">
          <span className="text-xs font-medium text-olive uppercase tracking-wider">
            {typeLabel}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-charcoal-muted font-medium">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-xs text-olive font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-sand/60 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-olive to-olive-light"
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
                {currentQ.title}
              </h2>
              <p className="text-sm text-charcoal-muted mb-8">
                {currentQ.subtitle}
              </p>

              {/* Single select */}
              {currentQ.type === 'single' && currentQ.options && (
                <div className="flex flex-wrap gap-3">
                  {currentQ.options.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                      selected={currentValue === opt.value}
                      onClick={() => handleSingle(opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Multi select */}
              {currentQ.type === 'multi' && currentQ.options && (
                <div className="flex flex-wrap gap-3">
                  {currentQ.options.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                      selected={(currentValue as string[] || []).includes(opt.value)}
                      onClick={() => handleMulti(opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Dropdown pair (height) */}
              {currentQ.type === 'dropdown-pair' && currentQ.dropdowns && (
                <div className="grid grid-cols-2 gap-4">
                  {currentQ.dropdowns.map((dd, idx) => (
                    <Dropdown
                      key={dd.label}
                      label={dd.label}
                      options={dd.options}
                      value={(currentValue as Record<string, string>)?.[idx === 0 ? 'feet' : 'inches'] || ''}
                      onChange={(v) => handleDropdownPair(idx === 0 ? 'feet' : 'inches', v)}
                    />
                  ))}
                </div>
              )}

              {/* Single dropdown (weight) */}
              {currentQ.type === 'dropdown' && currentQ.dropdowns && (
                <Dropdown
                  label={currentQ.dropdowns[0].label}
                  options={currentQ.dropdowns[0].options}
                  value={(currentValue as string) || ''}
                  onChange={(v) => handleSingle(v)}
                />
              )}


            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <Button
              variant="ghost"
              onClick={handleBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {step === questions.length - 1 ? 'Analyze' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
