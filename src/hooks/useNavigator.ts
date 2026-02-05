import { useState } from 'react';
import type  { Answer, Offering, Recommendation, NavigatorStep, LeadershipMode, QuestionsData } from '../types/navigator.types';
import questionsData from '../data/questions.json';
import offeringsData from '../data/offerings.json';

export const useNavigator = () => {
  const [currentStep, setCurrentStep] = useState<NavigatorStep>('landing');
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leadershipMode, setLeadershipMode] = useState<LeadershipMode>('technical');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const data = questionsData as QuestionsData;
  const offerings = offeringsData.offerings as Offering[];

  // Get context-specific questions
  const contextQuestions = selectedContext 
    ? data.contexts[selectedContext]?.questions || []
    : [];

  const selectContext = (contextId: string) => {
    setSelectedContext(contextId);
    setCurrentQuestionIndex(0); // Reset question index
    setAnswers([]); // Clear previous answers
    setCurrentStep('questions');
  };

  const addAnswer = (questionId: string, optionId: string, tags: string[], weight: number) => {
    const newAnswer: Answer = { questionId, optionId, tags, weight };
    setAnswers(prev => [...prev, newAnswer]);
    
    if (currentQuestionIndex < contextQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateRecommendation([...answers, newAnswer]);
    }
  };

  const generateRecommendation = (allAnswers: Answer[]) => {
    // Aggregate tag scores
    const tagScores: Record<string, number> = {};
    
    // Add heavy context weight
    if (selectedContext) {
      const contextWeightMap: Record<string, string[]> = {
        'data': ['data_transformation_high', 'data_transformation_primary'],
        'ai': ['ai_integration_primary', 'ai_integration_high'],
        'apps': ['amm_primary', 'amm_high'],
        'speed': ['product_engineering_primary', 'product_engineering_high'],
        'cost': ['cost_optimization', 'finops_critical'],
        'customer': ['product_engineering_fit', 'ai_integration_medium', 'data_transformation_medium']
      };
      
      const contextTags = contextWeightMap[selectedContext] || [];
      contextTags.forEach(tag => {
        tagScores[tag] = 8; // Very high weight for initial context
      });
    }
    
    // Add answer weights
    allAnswers.forEach(answer => {
      answer.tags.forEach(tag => {
        tagScores[tag] = (tagScores[tag] || 0) + answer.weight;
      });
    });

    // Score each offering
    const offeringScores = offerings.map(offering => {
      const score = Object.entries(tagScores)
        .filter(([tag]) => tag.includes(offering.tagPrefix) || tag.includes(offering.id))
        .reduce((sum, [, value]) => sum + value, 0);
      
      return { offering, score };
    });

    // Sort by score
    offeringScores.sort((a, b) => b.score - a.score);

    // Primary = highest score
    const primary = offeringScores[0].offering;
    
    // Complementary = next 1-2 with score > threshold
    const complementary = offeringScores
      .slice(1)
      .filter(o => o.score >= 6)
      .slice(0, 2)
      .map(o => o.offering);

    // Calculate confidence
    const totalScore = offeringScores.reduce((sum, o) => sum + o.score, 0);
    const confidence = totalScore > 0 
      ? Math.min(Math.round((offeringScores[0].score / totalScore) * 100), 95)
      : 50;

    // Generate rationale
    const topTags = Object.entries(tagScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag.replace(/_/g, ' '));

    const rationale = `Based on your ${topTags.join(', ')} priorities`;

    setRecommendation({ primary, complementary, confidence, rationale });
    setCurrentStep('results');
  };

  const reset = () => {
    setCurrentStep('landing');
    setSelectedContext(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setRecommendation(null);
  };

  const toggleLeadershipMode = () => {
    setLeadershipMode(prev => prev === 'technical' ? 'leadership' : 'technical');
  };

  return {
    currentStep,
    setCurrentStep,
    selectedContext,
    selectContext,
    answers,
    addAnswer,
    currentQuestion: contextQuestions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: contextQuestions.length,
    leadershipMode,
    toggleLeadershipMode,
    recommendation,
    reset,
  };
};