/**
 * Default labels registry — centralizes all hardcoded UI strings.
 * Used by AdminContext for the override system.
 * Keys use dot-notation: "screen.element"
 */
export const DEFAULT_LABELS: Record<string, string> = {
  // ─── LandingScreen ───
  'landing.heading': 'Microsoft Transformation\nNavigator',
  'landing.subtitle': 'Discover your transformation path with IBM + Microsoft',
  'landing.attribution': 'Powered by IBM Consulting',
  'landing.cta': 'Begin Your Journey',
  'landing.trustLine': 'Trusted by global enterprises modernizing with Microsoft and IBM',

  // ─── ScenarioSelector ───
  'scenario.backButton': 'Back',
  'scenario.heading': 'What best describes your current challenge?',
  'scenario.subheading': 'Select the scenario that resonates most with your situation',
  'scenario.group.DT': 'Data Transformation',
  'scenario.group.AMM': 'App Modernization',
  'scenario.group.DPDE': 'Product Engineering',
  'scenario.group.default': 'Transformation',
  'scenario.comingSoon': 'Coming Soon',
  'scenario.explore': 'Explore',

  // ─── SubScenarioSelector ───
  'subscenario.backButton': 'Back to scenarios',
  'subscenario.heading': 'Tell us more about your situation',
  'subscenario.subheading': 'Select the option that best matches where you are today',

  // ─── QuestionFlow ───
  'question.backToSub': 'Back to sub-scenarios',
  'question.backPrevious': 'Previous question',

  // ─── RecommendationScreen ───
  'results.badge': 'Personalized Recommendation',
  'results.heading': 'Your Transformation Path',
  'results.solutionOptics': 'Solution Optics',
  'results.basedOnResponses': 'Based on your responses',
  'results.badgePrimary': 'Primary',
  'results.badgeSupporting': 'Supporting',
  'results.badgeOptional': 'Optional',
  'results.yourChallenge': 'Your Challenge',
  'results.ibmSolution': 'IBM + Microsoft Solution',
  'results.deliveryApproach': 'Delivery Approach',
  'results.keyCapabilities': 'Key Capabilities',
  'results.techStack': 'Technology Stack',
  'results.whatIbmOffers': 'What IBM Offers',
  'results.signalAnalysis': 'Signal Path Analysis',
  'results.supportingCapability': 'Supporting Capability',
  'results.startOver': 'Start Over',
  'results.scanReport': 'Scan for Full Report',
  'results.scanDetails': 'Scan for details',

  // Offering display labels
  'results.offeringLabel.Data': 'Data Transformation',
  'results.offeringLabel.AI': 'AI Integration',
  'results.offeringLabel.AMM': 'Application Migration & Modernization',
  'results.offeringLabel.DPDE': 'Digital Product Design & Engineering',

  // Offer type labels
  'results.offerType.video': 'Video',
  'results.offerType.demo': 'Live Demo',
  'results.offerType.architecture': 'Architecture',
  'results.offerType.document': 'Document',
  'results.offerType.tool': 'Tool',

  // ─── NavigatorLayout ───
  'layout.location': 'Bangalore',
  'layout.date': 'March 8, 2026',

  // ─── IdleWarningModal ───
  'idle.title': 'Still exploring?',
  'idle.subtitle': 'This session will reset in',
  'idle.cta': 'Tap to Continue',
};

/** Default config values for admin-editable numeric settings */
export const DEFAULT_CONFIG: Record<string, number> = {
  'idleTimeoutMs': 120000,
  'warningMs': 15000,
  'supportingThreshold': 0.4,
  'optionalThreshold': 0.25,
  'minScoreToDisplay': 10,
};
