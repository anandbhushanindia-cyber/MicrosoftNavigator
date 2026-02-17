// --- Sub-Scenario ---
export interface SubScenario {
  id: string;
  text: string;
  businessMeaning: string;
  signalPath: string;
  weight: number;
}

// --- Questions ---
export interface QuestionOption {
  id: string;
  text: string;
  businessMeaning: string;
  signalPath: string;
  weight: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

// --- IBM Offer (rich media item) ---
export interface IBMOffer {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'architecture' | 'demo' | 'document' | 'tool';
  mediaUrl?: string;
  thumbnailUrl?: string;
  referenceUrl: string;
  fileType?: 'mp4' | 'png' | 'pdf' | 'pptx' | 'xlsx' | 'jpg';
  fileSize?: string;
}

// --- Signal Path Mapping ---
export interface SignalPathMapping {
  signalPath: string;
  primaryRecommendation: string;
  supportingCapability: string;
  description: string;
  techStack: string[];
  challenges: string[];
  solutions: string[];
  approach: string[];
  capabilities: string[];
  ibmOffers: IBMOffer[];
}

// --- Scenario (top-level) ---
export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  offeringGroup?: string;
  subScenarios: SubScenario[];
  questions: Question[];
  signalPathMappings: SignalPathMapping[];
}

// --- Offerings ---
export type OfferingName = 'Data' | 'AI' | 'AMM' | 'DPDE';

export interface OfferingScore {
  offering: OfferingName;
  score: number;
}

export interface SignalOfferingMapping {
  signalPath: string;
  Data: number;
  AI: number;
  AMM: number;
  DPDE: number;
}

// --- Scoring ---
export interface SignalPathScore {
  signalPath: string;
  score: number;
}

export interface Answer {
  questionId: string;
  optionId: string;
  signalPath: string;
  weight: number;
}

// --- Recommendation ---
export interface Recommendation {
  offeringGroup?: string;
  scenarioTitle: string;
  subScenarioText: string;
  primaryOffering: OfferingName;
  supportingOffering?: OfferingName;
  optionalOffering?: OfferingName;
  offeringScores: OfferingScore[];
  primarySignalPath: string;
  primaryRecommendation: string;
  primaryDescription: string;
  primaryTechStack: string[];
  supportingSignalPath: string;
  supportingCapability: string;
  supportingDescription: string;
  confidence: number;
  signalScores: SignalPathScore[];
  challenges: string[];
  solutions: string[];
  approach: string[];
  capabilities: string[];
  ibmOffers: IBMOffer[];
}

// --- Contextual Content (sub-scenario + signal path specific) ---
export interface ContextualContent {
  challenges: string[];
  solutions: string[];
  approach: string[];
}

export interface AnswerModifier {
  challengeAppend?: string;
  solutionAppend?: string;
}

export interface ContextualContentFile {
  entries: Record<string, ContextualContent>;       // key = "subScenarioId:primarySignalPath"
  answerModifiers: Record<string, AnswerModifier>;  // key = questionOptionId
}

// --- Navigation ---
export type NavigatorStep = 'landing' | 'scenario' | 'subscenario' | 'questions' | 'results';
export type LeadershipMode = 'technical' | 'leadership';

// --- Kiosk ---
export interface KioskConfig {
  idleTimeoutMs: number;
  warningDurationMs: number;
  touchTargetMinPx: number;
  enableFullscreen: boolean;
  preventGestures: boolean;
}
