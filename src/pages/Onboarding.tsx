import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';

import { useStore } from '../lib/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'gender', title: 'What is your gender?', subtitle: 'This helps us tailor recommendations' },
  { id: 'age', title: 'How old are you?', subtitle: 'Age affects skin needs and nutrition' },
  { id: 'skinType', title: 'What\'s your skin type?', subtitle: 'Select the one that best describes your skin' },
  { id: 'dietPref', title: 'Dietary preference?', subtitle: 'We\'ll customize your nutrition plan' },
];

const genderOptions = [
  { label: 'Male', icon: '🧔', value: 'male' },
  { label: 'Female', icon: '👩', value: 'female' },
  { label: 'Non-binary', icon: '🧑', value: 'non-binary' },
  { label: 'Prefer not to say', icon: '😶‍🌫️', value: 'other' },
];

const ageRanges = [
  { label: '18 – 24', value: '18-24' },
  { label: '25 – 34', value: '25-34' },
  { label: '35 – 44', value: '35-44' },
  { label: '45 – 54', value: '45-54' },
  { label: '55+', value: '55+' },
];

const skinTypes = [
  { label: 'Normal', icon: '✨', value: 'normal' },
  { label: 'Oily', icon: '💧', value: 'oily' },
  { label: 'Dry', icon: '🌵', value: 'dry' },
  { label: 'Combination', icon: '⚖️', value: 'combination' },
  { label: 'Sensitive', icon: '🌸', value: 'sensitive' },
];

const dietPrefs = [
  { label: 'Balanced', icon: '🥗', value: 'balanced' },
  { label: 'Vegetarian', icon: '🥦', value: 'vegetarian' },
  { label: 'Vegan', icon: '🌱', value: 'vegan' },
  { label: 'Keto', icon: '🥑', value: 'keto' },
  { label: 'Mediterranean', icon: '🍊', value: 'mediterranean' },
  { label: 'No Preference', icon: '🍽️', value: 'none' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [skinType, setSkinType] = useState('');
  const [dietPref, setDietPref] = useState('');
  const navigate = useNavigate();
  const { setUser, user, setOnboardingComplete } = useStore();

  const progress = ((step + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0: return !!gender;
      case 1: return !!age;
      case 2: return !!skinType;
      case 3: return !!dietPref;
      default: return false;
    }
  };

  const handleFinish = () => {
    if (user) {
      setUser({ ...user, gender, skinType, dietPreference: dietPref });
    }
    setOnboardingComplete(true);
    navigate('/dashboard');
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <PageTransition className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-charcoal-muted font-medium">
              Step {step + 1} of {steps.length}
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

        {/* Card */}
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
                {steps[step].title}
              </h2>
              <p className="text-sm text-charcoal-muted mb-8">
                {steps[step].subtitle}
              </p>

              {/* Step 0: Gender */}
              {step === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((opt) => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setGender(opt.value)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        gender === opt.value
                          ? 'border-olive bg-olive/8 shadow-md'
                          : 'border-transparent bg-white hover:bg-cream-dark'
                      }`}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 1: Age */}
              {step === 1 && (
                <div className="flex flex-wrap gap-3">
                  {ageRanges.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      selected={age === opt.value}
                      onClick={() => setAge(opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Step 2: Skin Type */}
              {step === 2 && (
                <div className="flex flex-wrap gap-3">
                  {skinTypes.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                      selected={skinType === opt.value}
                      onClick={() => setSkinType(opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Step 3: Diet */}
              {step === 3 && (
                <div className="flex flex-wrap gap-3">
                  {dietPrefs.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                      selected={dietPref === opt.value}
                      onClick={() => setDietPref(opt.value)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {step === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
