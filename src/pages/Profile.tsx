import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useStore } from '../lib/store';
import { Save, User } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    if (user) {
      setUser({ ...user, name, email });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageTransition className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            Your Profile
          </h1>
          <p className="text-charcoal-muted text-sm">Manage your account information.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card glass padding="lg">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-olive/10 flex items-center justify-center">
                <User className="w-7 h-7 text-olive" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-charcoal-muted">{user?.email || 'email@example.com'}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-olive font-medium"
                >
                  ✓ Changes saved
                </motion.span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <Card glass padding="sm">
            <div className="text-xs text-charcoal-muted mb-1">Skin Type</div>
            <div className="text-sm font-semibold text-charcoal capitalize">
              {user?.skinType || 'Not set'}
            </div>
          </Card>
          <Card glass padding="sm">
            <div className="text-xs text-charcoal-muted mb-1">Diet</div>
            <div className="text-sm font-semibold text-charcoal capitalize">
              {user?.dietPreference || 'Not set'}
            </div>
          </Card>
          <Card glass padding="sm">
            <div className="text-xs text-charcoal-muted mb-1">Gender</div>
            <div className="text-sm font-semibold text-charcoal capitalize">
              {user?.gender || 'Not set'}
            </div>
          </Card>
          <Card glass padding="sm">
            <div className="text-xs text-charcoal-muted mb-1">Age</div>
            <div className="text-sm font-semibold text-charcoal">
              {user?.age || 'Not set'}
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
