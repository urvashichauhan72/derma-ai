// ─── API Functions ───
// Connected to FastAPI backend at localhost:8000

const API_BASE = 'http://localhost:8000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  skinType: string;
  dietPreference: string;
}

export interface AnalysisResult {
  id: string;
  type: 'mens-skincare' | 'womens-skincare' | 'diet';
  date: string;
  summary: string;
  report: string; // AI-generated markdown report
  recommendations: Recommendation[];
  routine?: RoutineStep[];
  dietPlan?: DietPlan;
  score: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface RoutineStep {
  step: number;
  name: string;
  product: string;
  time: string;
  description: string;
}

export interface DietPlan {
  calories: number;
  meals: Meal[];
  nutrients: Nutrient[];
}

export interface Meal {
  name: string;
  time: string;
  items: string[];
  calories: number;
}

export interface Nutrient {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface AnalysisHistory {
  id: string;
  type: string;
  date: string;
  summary: string;
  score: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Auth (still mocked — no DB yet) ───
export async function loginUser(email: string, _password: string): Promise<User> {
  await simulateDelay(800);
  return {
    id: '1',
    name: 'Sophia',
    email,
    age: 28,
    gender: 'female',
    skinType: 'combination',
    dietPreference: 'balanced',
  };
}

export async function signupUser(data: Partial<User> & { password: string }): Promise<User> {
  await simulateDelay(800);
  return {
    id: '1',
    name: data.name || '',
    email: data.email || '',
    age: data.age || 0,
    gender: data.gender || '',
    skinType: data.skinType || '',
    dietPreference: data.dietPreference || '',
  };
}

// ─── User ───
export async function updateUser(data: Partial<User>): Promise<User> {
  await simulateDelay(600);
  return data as User;
}

export async function getUserProfile(): Promise<User> {
  await simulateDelay(400);
  return {
    id: '1',
    name: 'Sophia',
    email: 'sophia@example.com',
    age: 28,
    gender: 'female',
    skinType: 'combination',
    dietPreference: 'balanced',
  };
}

// ─── Analysis (connected to FastAPI + Groq AI) ───
export async function submitAnalysis(type: string, answers: Record<string, unknown>): Promise<AnalysisResult> {
  let endpoint = '';
  let body = {};

  if (type === 'mens-skincare') {
    endpoint = '/men-skincare';
    body = { concern: buildConcernFromAnswers(answers) };
  } else if (type === 'womens-skincare') {
    endpoint = '/women-skincare';
    body = { concern: buildConcernFromAnswers(answers) };
  } else if (type === 'diet') {
    endpoint = '/diet-plan';
    body = { 
      gender: (answers.gender as string) || 'Female', 
      dietType: (answers.dietType as string) || 'Vegetarian', 
      skinConcern: buildDietContextFromAnswers(answers) 
    };
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return {
      id: data.id,
      type: data.type as AnalysisResult['type'],
      date: data.date,
      summary: data.summary,
      report: data.report,
      score: data.score,
      recommendations: [],
      routine: undefined,
      dietPlan: undefined,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      id: `error-${Date.now()}`,
      type: type as AnalysisResult['type'],
      date: new Date().toISOString(),
      summary: 'Error generating report.',
      report: '⚠️ Failed to connect to AI service or Database.',
      score: 0,
      recommendations: [],
    };
  }
}

// ─── Derma Chat (connected to FastAPI + Groq AI) ───
export async function sendDermaChat(message: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/derma-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error: ${res.status}`);
  }
  const data = await res.json();
  return data.reply;
}

// ─── History (Connected to MongoDB via backend) ───
export async function getAnalysisHistory(): Promise<AnalysisHistory[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}

export async function getAnalysisResult(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/history/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch result: ${res.status}`);
  }
  return await res.json();
}

// ─── Helpers ───
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildConcernFromAnswers(answers: Record<string, unknown>): string {
  const parts: string[] = [];
  if (answers.concerns) {
    const concerns = answers.concerns as string[];
    parts.push(`My skin concerns are: ${concerns.join(', ')}`);
  }
  if (answers.routine) parts.push(`Current skincare routine level: ${answers.routine}`);
  if (answers.sunExposure) parts.push(`Daily sun exposure: ${answers.sunExposure}`);
  if (answers.waterIntake) parts.push(`Daily water intake: ${answers.waterIntake}`);
  if (answers.sleep) parts.push(`Average sleep per night: ${answers.sleep}`);
  return parts.length > 0 ? parts.join('. ') + '.' : 'General skincare advice needed.';
}

function buildDietContextFromAnswers(answers: Record<string, unknown>): string {
  const parts: string[] = [];
  if (answers.height) {
    const h = answers.height as Record<string, string>;
    parts.push(`Height: ${h.feet || '?'} ft ${h.inches || '0'} in`);
  }
  if (answers.weight) parts.push(`Weight range: ${answers.weight}`);
  if (answers.activityLevel) parts.push(`Activity level: ${answers.activityLevel}`);
  if (answers.allergies) {
    const allergies = answers.allergies as string[];
    parts.push(`Food allergies: ${allergies.join(', ')}`);
  }
  if (answers.goal) parts.push(`Primary nutrition goal: ${answers.goal}`);
  return parts.length > 0 ? parts.join('. ') + '.' : 'General skin-health diet needed.';
}
