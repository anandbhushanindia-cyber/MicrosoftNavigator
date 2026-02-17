import { useState, useMemo } from 'react';
import type {
  Answer,
  Recommendation,
  NavigatorStep,
  SignalPathScore,
  OfferingName,
  OfferingScore,
  SignalOfferingMapping,
  IBMOffer,
  ContextualContentFile,
  ContextualContent,
} from '../types/navigator.types';
import { useAdmin } from '../contexts/AdminContext';
import contextualContentData from '../data/contextualContent.json';

const contextualContent = contextualContentData as ContextualContentFile;

const OFFERING_NAMES: OfferingName[] = ['Data', 'AI', 'AMM', 'DPDE'];

export const useNavigator = () => {
  const { getScenarios, getSignalMatrix, getConfig } = useAdmin();

  const [currentStep, setCurrentStep] = useState<NavigatorStep>('landing');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedSubScenarioId, setSelectedSubScenarioId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const scenarios = getScenarios();
  const signalMatrix = getSignalMatrix();

  // Admin-configurable thresholds
  const SUPPORTING_THRESHOLD = getConfig('supportingThreshold');
  const OPTIONAL_THRESHOLD = getConfig('optionalThreshold');
  const MIN_SCORE_TO_DISPLAY = getConfig('minScoreToDisplay');

  // Build lookup map for signal → offering multipliers
  const signalMatrixMap = useMemo(() => {
    const map: Record<string, SignalOfferingMapping> = {};
    for (const entry of signalMatrix) {
      map[entry.signalPath] = entry;
    }
    return map;
  }, [signalMatrix]);

  // Derived state
  const selectedScenario = useMemo(
    () => scenarios.find(s => s.id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId]
  );

  const selectedSubScenario = useMemo(
    () => selectedScenario?.subScenarios.find(ss => ss.id === selectedSubScenarioId) ?? null,
    [selectedScenario, selectedSubScenarioId]
  );

  const scenarioQuestions = selectedScenario?.questions ?? [];

  // Helper: look up offering multipliers for a signal path
  const getMultipliers = (signalPath: string): Record<OfferingName, number> => {
    const entry = signalMatrixMap[signalPath];
    if (entry) {
      return { Data: entry.Data, AI: entry.AI, AMM: entry.AMM, DPDE: entry.DPDE };
    }
    return { Data: 0, AI: 0, AMM: 0, DPDE: 0 };
  };

  // --- Actions ---

  const selectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setSelectedSubScenarioId(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setRecommendation(null);
    setCurrentStep('subscenario');
  };

  const selectSubScenario = (subScenarioId: string) => {
    setSelectedSubScenarioId(subScenarioId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setRecommendation(null);
    setCurrentStep('questions');
  };

  const addAnswer = (questionId: string, optionId: string, signalPath: string, weight: number) => {
    const newAnswer: Answer = { questionId, optionId, signalPath, weight };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < scenarioQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateRecommendation(updatedAnswers);
    }
  };

  const generateRecommendation = (allAnswers: Answer[]) => {
    const scenario = scenarios.find(s => s.id === selectedScenarioId);
    const subScenario = scenario?.subScenarios.find(ss => ss.id === selectedSubScenarioId);

    if (!scenario || !subScenario) return;

    // 1. Initialize offering scores
    const offeringTotals: Record<OfferingName, number> = { Data: 0, AI: 0, AMM: 0, DPDE: 0 };

    // 2. Initialize signal path scores (for display)
    const signalScores: Record<string, number> = {};

    // 3. Process sub-scenario signal
    const subMultipliers = getMultipliers(subScenario.signalPath);
    for (const offering of OFFERING_NAMES) {
      offeringTotals[offering] += subScenario.weight * subMultipliers[offering];
    }
    signalScores[subScenario.signalPath] = (signalScores[subScenario.signalPath] || 0) + subScenario.weight;

    // 4. Process each answer
    for (const answer of allAnswers) {
      const multipliers = getMultipliers(answer.signalPath);
      for (const offering of OFFERING_NAMES) {
        offeringTotals[offering] += answer.weight * multipliers[offering];
      }
      signalScores[answer.signalPath] = (signalScores[answer.signalPath] || 0) + answer.weight;
    }

    // 5. Sort offerings by score descending
    const sortedOfferings: OfferingScore[] = OFFERING_NAMES
      .map(offering => ({ offering, score: offeringTotals[offering] }))
      .sort((a, b) => b.score - a.score);

    const primaryOfferingScore = sortedOfferings[0];
    const primaryOffering = primaryOfferingScore.offering;

    // 6. Determine supporting and optional offerings
    let supportingOffering: OfferingName | undefined;
    let optionalOffering: OfferingName | undefined;

    if (sortedOfferings.length > 1) {
      const second = sortedOfferings[1];
      if (second.score >= primaryOfferingScore.score * SUPPORTING_THRESHOLD && second.score >= MIN_SCORE_TO_DISPLAY) {
        supportingOffering = second.offering;
      }
    }
    if (sortedOfferings.length > 2) {
      const third = sortedOfferings[2];
      if (third.score >= primaryOfferingScore.score * OPTIONAL_THRESHOLD && third.score >= MIN_SCORE_TO_DISPLAY) {
        optionalOffering = third.offering;
      }
    }

    // 7. Sort signal paths by score for display
    const sortedSignals: SignalPathScore[] = Object.entries(signalScores)
      .map(([signalPath, score]) => ({ signalPath, score }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.signalPath === subScenario.signalPath) return -1;
        if (b.signalPath === subScenario.signalPath) return 1;
        return 0;
      });

    // 8. Look up scenario's signal path mapping for rich content
    const primarySignal = sortedSignals[0];
    const supportingSignal = sortedSignals.length > 1 ? sortedSignals[1] : null;
    const mappings = scenario.signalPathMappings;
    const primaryMapping = mappings.find(m => m.signalPath === primarySignal.signalPath);
    const supportingMapping = supportingSignal
      ? mappings.find(m => m.signalPath === supportingSignal.signalPath)
      : null;

    // 9. Calculate confidence
    const totalOfferingScore = sortedOfferings.reduce((sum, s) => sum + s.score, 0);
    const confidence = totalOfferingScore > 0
      ? Math.min(Math.round((primaryOfferingScore.score / totalOfferingScore) * 100), 95)
      : 70;

    // IBM Offers are loaded dynamically by RecommendationScreen via useArtifacts hook
    const offeringGroup = scenario.offeringGroup || '';
    const ibmOffers: IBMOffer[] = [];

    // 10. Resolve contextual content (sub-scenario + primary signal specific)
    const contextKey = `${selectedSubScenarioId}:${primarySignal.signalPath}`;
    const contextual: ContextualContent | undefined = contextualContent.entries[contextKey];

    // Fallback chain: contextual (journey-specific) → signalPathMapping (signal-level) → empty
    let resolvedChallenges = contextual?.challenges || primaryMapping?.challenges || [];
    let resolvedSolutions = contextual?.solutions || primaryMapping?.solutions || [];
    const resolvedApproach = contextual?.approach || primaryMapping?.approach || [];

    // 11. Inject answer modifiers for high-weight (≥3) answers
    if (contextualContent.answerModifiers) {
      for (const answer of allAnswers) {
        if (answer.weight >= 3) {
          const mod = contextualContent.answerModifiers[answer.optionId];
          if (mod?.challengeAppend && !resolvedChallenges.includes(mod.challengeAppend)) {
            resolvedChallenges = [...resolvedChallenges, mod.challengeAppend];
          }
          if (mod?.solutionAppend && !resolvedSolutions.includes(mod.solutionAppend)) {
            resolvedSolutions = [...resolvedSolutions, mod.solutionAppend];
          }
        }
      }
    }

    // Cap at 5 items to prevent visual overflow
    resolvedChallenges = resolvedChallenges.slice(0, 5);
    resolvedSolutions = resolvedSolutions.slice(0, 5);

    setRecommendation({
      offeringGroup,
      scenarioTitle: scenario.title,
      subScenarioText: subScenario.text,
      primaryOffering,
      supportingOffering,
      optionalOffering,
      offeringScores: sortedOfferings,
      primarySignalPath: primarySignal.signalPath,
      primaryRecommendation: primaryMapping?.primaryRecommendation || primarySignal.signalPath,
      primaryDescription: primaryMapping?.description || '',
      primaryTechStack: primaryMapping?.techStack || [],
      supportingSignalPath: supportingSignal?.signalPath || '',
      supportingCapability: supportingMapping?.supportingCapability || '',
      supportingDescription: supportingMapping?.description || '',
      confidence,
      signalScores: sortedSignals,
      challenges: resolvedChallenges,
      solutions: resolvedSolutions,
      approach: resolvedApproach,
      capabilities: primaryMapping?.capabilities || [],
      ibmOffers,
    });
    setCurrentStep('results');
  };

  const goBack = () => {
    switch (currentStep) {
      case 'scenario':
        setCurrentStep('landing');
        setSelectedScenarioId(null);
        break;
      case 'subscenario':
        setCurrentStep('scenario');
        setSelectedSubScenarioId(null);
        break;
      case 'questions':
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
          setAnswers(prev => prev.slice(0, -1));
        } else {
          setCurrentStep('subscenario');
          setAnswers([]);
        }
        break;
      case 'results':
        setCurrentStep('subscenario');
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setRecommendation(null);
        break;
      default:
        break;
    }
  };

  const reset = () => {
    setCurrentStep('landing');
    setSelectedScenarioId(null);
    setSelectedSubScenarioId(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setRecommendation(null);
  };

  return {
    // State
    currentStep,
    selectedScenarioId,
    selectedSubScenarioId,
    selectedScenario,
    selectedSubScenario,
    answers,
    currentQuestion: scenarioQuestions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: scenarioQuestions.length,
    recommendation,
    scenarios,

    // Actions
    setCurrentStep,
    selectScenario,
    selectSubScenario,
    addAnswer,
    goBack,
    reset,
  };
};
