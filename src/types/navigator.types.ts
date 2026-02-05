export interface QuestionOption {
  id: string;
  text: string;
  tags: string[];
  weight: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface ContextQuestions {
  name: string;
  questions: Question[];
}

export interface QuestionsData {
  contexts: {
    [key: string]: ContextQuestions;
  };
}

export interface ViewMode {
  problem: string;
  solution: string;
  approach: string;
}

export interface Offering {
  id: string;
  name: string;
  tagPrefix: string;
  icon: string;
  shortDescription: string;
  capabilities: string[];
  readinessSignals: string[];
  technicalView: ViewMode;
  leadershipView: ViewMode;
  demoVideo?: string;
  collateralPDF?: string;
}

export interface Answer {
  questionId: string;
  optionId: string;
  tags: string[];
  weight: number;
}

export interface Recommendation {
  primary: Offering;
  complementary: Offering[];
  confidence: number;
  rationale: string;
}

export type NavigatorStep = 'landing' | 'context' | 'questions' | 'results';
export type LeadershipMode = 'technical' | 'leadership';