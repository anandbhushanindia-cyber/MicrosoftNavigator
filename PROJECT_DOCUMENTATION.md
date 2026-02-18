# Microsoft Navigator - Complete Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [User Flow](#2-user-flow)
3. [Project Structure](#3-project-structure)
4. [Type Definitions](#4-type-definitions)
5. [Signal Mapping Matrix](#5-signal-mapping-matrix)
6. [Scoring Algorithm & Recommendation Engine](#6-scoring-algorithm--recommendation-engine)
7. [Scenarios Overview](#7-scenarios-overview)
8. [Complete Question Mapping Tables](#8-complete-question-mapping-tables)
9. [Admin System](#9-admin-system)
10. [Contextual Content System](#10-contextual-content-system)
11. [Kiosk & Idle Timeout](#11-kiosk--idle-timeout)
12. [Artifact System](#12-artifact-system)
13. [Components Reference](#13-components-reference)
14. [Configuration & Labels](#14-configuration--labels)

---

## 1. Project Overview

**Name:** microsoft-navigator
**Version:** 0.0.0
**Type:** React + TypeScript SPA (Single Page Application)
**Platform:** Kiosk-optimized touchscreen web application
**Purpose:** A digital transformation assessment tool that guides enterprise users through a multi-step questionnaire to receive personalized IBM + Microsoft solution recommendations.

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool / dev server |
| Tailwind CSS | 3.4.17 | Utility-first CSS |
| Framer Motion | 12.31.0 | Animations & transitions |
| Lucide React | 0.563.0 | Icon library |

### NPM Scripts
```bash
npm run dev      # Local development server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint linting
npm run preview  # Preview production build
```

### Deployment
- **Azure Static Web Apps** (primary)
- **Firebase Hosting** (alternate)
- Environment variable: `VITE_ARTIFACT_BASE_URL` for Azure Blob Storage

---

## 2. User Flow

```
[1. Landing Screen]
    |  "Begin Your Journey" button
    v
[2. Scenario Selector] — Choose 1 of 8 transformation challenges
    |  Grouped by offering: DT / AMM / DPDE
    v
[3. Sub-Scenario Selector] — Choose 1 of 4 specific problem areas
    |  Each has a signalPath + weight
    v
[4. Question Flow] — Answer 5 questions (4 options each)
    |  Each option carries: signalPath + weight (1-3)
    |  Progress bar: "Question N of 5"
    v
[5. Recommendation Screen] — Personalized results
    |  Primary / Supporting / Optional offerings
    |  Challenges, Solutions, Approach, Capabilities
    |  IBM Solution artifacts (videos, PDFs, PPTs)
    |  "Start Over" → back to Landing
    v
[1. Landing Screen] (loop)
```

### Navigation Back Flow
- **Questions → Previous Question** (removes last answer)
- **Question 1 → Sub-Scenario Selector** (clears answers)
- **Sub-Scenario → Scenario Selector** (clears sub-selection)
- **Scenario → Landing** (clears scenario selection)
- **Results → Sub-Scenario Selector** (clears answers & recommendation)

### Idle Timeout (Kiosk Mode)
- After **120 seconds** of inactivity: warning modal appears
- **15-second countdown** with "Tap to Continue" button
- If not dismissed: auto-reset to Landing screen

---

## 3. Project Structure

```
MicrosoftNavigator/
├── src/
│   ├── App.tsx                                # Root: AdminProvider + kiosk mode
│   ├── main.tsx                               # React DOM entry point
│   ├── index.css                              # Global styles
│   │
│   ├── pages/
│   │   └── NavigatorPage.tsx                  # Main page orchestrator
│   │
│   ├── components/
│   │   ├── navigator/
│   │   │   ├── LandingScreen.tsx              # Welcome screen
│   │   │   ├── NavigatorLayout.tsx            # Header/footer layout
│   │   │   ├── ScenarioSelector.tsx           # 8 scenario cards
│   │   │   ├── SubScenarioSelector.tsx        # 4 sub-scenario cards
│   │   │   ├── QuestionFlow.tsx               # Question + 4 options
│   │   │   ├── RecommendationScreen.tsx       # Results display
│   │   │   ├── IdleWarningModal.tsx           # Timeout warning
│   │   │   ├── DocumentCard.tsx               # Office file display
│   │   │   └── ZoomableMediaModal.tsx         # Media lightbox
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminToolbar.tsx               # Admin floating panel
│   │   │   ├── EditableText.tsx               # Inline text editor
│   │   │   └── EditableList.tsx               # List editor
│   │   │
│   │   └── visualizations/
│   │       ├── AnimatedBackground.tsx         # Background manager
│   │       ├── shared/                        # Shared visual components
│   │       └── variants/                      # 5 animation variants
│   │
│   ├── contexts/
│   │   └── AdminContext.tsx                    # Admin state provider
│   │
│   ├── hooks/
│   │   ├── useNavigator.ts                    # Navigation + scoring logic
│   │   ├── useAdminMode.ts                    # Admin state management
│   │   ├── useIdleTimeout.ts                  # Idle timeout logic
│   │   └── useArtifacts.ts                    # Artifact loading
│   │
│   ├── types/
│   │   └── navigator.types.ts                 # All TypeScript types
│   │
│   ├── data/
│   │   ├── scenarios.json                     # 9,077 lines - scenarios + questions
│   │   ├── contextualContent.json             # 1,498 lines - contextual overrides
│   │   ├── labels.ts                          # Default UI labels + config
│   │   └── artifactManifest.ts                # Static artifact fallback
│   │
│   ├── config/
│   │   └── artifacts.ts                       # Artifact storage config
│   │
│   ├── services/
│   │   └── artifactService.ts                 # Azure Blob Storage fetcher
│   │
│   └── utils/
│       ├── kiosk.ts                           # Kiosk lockdown utilities
│       └── artifactHelpers.ts                 # Artifact helpers
│
├── metadata/                                  # Offering metadata
│   ├── DT-metadata.json
│   ├── AMM-metadata.json
│   └── DPDE-metadata.json
│
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
├── firebase.json
└── staticwebapp.config.json
```

---

## 4. Type Definitions

### Core Data Types

```typescript
// --- Sub-Scenario (4 per scenario) ---
interface SubScenario {
  id: string;              // e.g., "sc1_sub1"
  text: string;            // Display text
  businessMeaning: string; // Internal description
  signalPath: string;      // e.g., "Data Platform Modernization"
  weight: number;          // 1-3, contributes to scoring
  questions: Question[];   // 5 questions per sub-scenario
}

// --- Question (5 per sub-scenario) ---
interface Question {
  id: string;              // e.g., "sc1_sub1_q1"
  text: string;            // The question text
  options: QuestionOption[];  // 4 options
}

// --- Question Option (4 per question) ---
interface QuestionOption {
  id: string;              // e.g., "sc1_sub1_q1_a"
  text: string;            // Display text
  businessMeaning: string; // Internal description
  signalPath: string;      // Maps to signal matrix
  weight: number;          // 1-3, scoring strength
}

// --- Scenario (8 total) ---
interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;            // Lucide icon name
  color: string;           // Tailwind gradient
  enabled: boolean;
  offeringGroup?: string;  // 'DT' | 'AMM' | 'DPDE'
  subScenarios: SubScenario[];
  signalPathMappings: SignalPathMapping[];
}

// --- Signal Path Mapping (per scenario) ---
interface SignalPathMapping {
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

// --- Offerings ---
type OfferingName = 'Data' | 'AI' | 'AMM' | 'DPDE';

interface SignalOfferingMapping {
  signalPath: string;
  Data: number;   // 0-3 multiplier
  AI: number;
  AMM: number;
  DPDE: number;
}

// --- Navigation ---
type NavigatorStep = 'landing' | 'scenario' | 'subscenario' | 'questions' | 'results';

// --- Answer Record ---
interface Answer {
  questionId: string;
  optionId: string;
  signalPath: string;
  weight: number;
}

// --- Recommendation Result ---
interface Recommendation {
  offeringGroup: string;
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
```

---

## 5. Signal Mapping Matrix

The signal mapping matrix defines how each signal path contributes to the 4 offering scores. Each signal path has a weight (0-3) per offering.

| # | Signal Path | Data | AI | AMM | DPDE |
|---|------------|------|-----|-----|------|
| 1 | Data Platform Modernization | 3 | 1 | 0 | 0 |
| 2 | Platform Consolidation | 3 | 1 | 0 | 0 |
| 3 | Platform Unification | 3 | 1 | 0 | 0 |
| 4 | Real-Time Analytics | 3 | 2 | 0 | 0 |
| 5 | AI-Ready Data Foundation | 1 | 3 | 0 | 0 |
| 6 | Data Governance | 2 | 2 | 0 | 0 |
| 7 | BI Optimization | 2 | 1 | 0 | 1 |
| 8 | AI Analytics Foundation | 1 | 3 | 0 | 0 |
| 9 | Real-Time AI Foundation | 1 | 3 | 0 | 0 |
| 10 | App Modernization | 0 | 0 | 3 | 0 |
| 11 | Cloud Optimization | 0 | 0 | 2 | 0 |
| 12 | Cloud-Native Transformation | 0 | 1 | 3 | 2 |
| 13 | DevOps Modernization | 0 | 1 | 3 | 2 |
| 14 | API Modernization | 0 | 1 | 3 | 2 |
| 15 | Integration Modernization | 0 | 1 | 3 | 2 |
| 16 | AI Integration | 1 | 3 | 2 | 2 |
| 17 | Dev Platform Modernization | 0 | 0 | 1 | 3 |
| 18 | Quality Engineering | 0 | 1 | 0 | 3 |
| 19 | Experience Engineering | 0 | 2 | 0 | 3 |
| 20 | AI Engineering | 1 | 3 | 0 | 2 |
| 21 | Hybrid Modernization | 0 | 0 | 3 | 0 |
| 22 | DevSecOps Modernization | 0 | 1 | 2 | 2 |
| 23 | Cloud-Native Optimization | 0 | 0 | 2 | 1 |
| 24 | DevSecOps Optimization | 0 | 1 | 2 | 2 |
| 25 | Compliance Modernization | 0 | 1 | 2 | 2 |
| 26 | Product Modernization | 0 | 0 | 1 | 3 |
| 27 | AI-Driven Product Engineering | 0 | 2 | 0 | 3 |
| 28 | Cloud-Native Engineering | 0 | 0 | 1 | 3 |
| 29 | AI-Driven Security | 0 | 2 | 1 | 2 |
| 30 | Security Platform Consolidation | 0 | 1 | 2 | 1 |
| 31 | Cloud Security Optimization | 0 | 1 | 2 | 1 |
| 32 | Platform Rationalization | 2 | 1 | 0 | 0 |
| 33 | Platform Optimization | 2 | 1 | 0 | 0 |
| 34 | AI Optimization | 1 | 2 | 0 | 0 |
| 35 | Governance Modernization | 2 | 1 | 0 | 0 |
| 36 | Governance Optimization | 2 | 1 | 0 | 0 |
| 37 | Data Unification | 3 | 1 | 0 | 0 |
| 38 | Compliance Automation | 0 | 1 | 2 | 2 |
| 39 | Compliance Optimization | 0 | 1 | 2 | 1 |
| 40 | AI Engineering Optimization | 0 | 2 | 0 | 3 |
| 41 | DevOps Optimization | 0 | 1 | 2 | 2 |
| 42 | Platform Rationalization (DPDE) | 0 | 0 | 1 | 2 |
| 43 | Application Modernization | 0 | 0 | 3 | 1 |
| 44 | App Modernization Security | 0 | 1 | 2 | 1 |
| 45 | Supply Chain Security | 0 | 1 | 1 | 2 |
| 46 | DevSecOps Automation | 0 | 1 | 2 | 2 |
| 47 | Product Optimization | 0 | 0 | 1 | 2 |
| 48 | Agile Engineering | 0 | 0 | 0 | 2 |
| 49 | AI-Driven Engineering | 0 | 2 | 0 | 3 |
| 50 | Experience Optimization | 0 | 1 | 0 | 2 |
| 51 | Real-Time Experience | 0 | 1 | 0 | 3 |
| 52 | AI Experience Engineering | 0 | 2 | 0 | 3 |
| 53 | AI Compliance | 0 | 2 | 1 | 2 |
| 54 | Experience Modernization | 0 | 1 | 0 | 3 |
| 55 | API Optimization | 0 | 0 | 2 | 1 |

---

## 6. Scoring Algorithm & Recommendation Engine

> **Source code:** `src/hooks/useNavigator.ts` — function `generateRecommendation()` (lines 101-235)

The recommendation engine takes two inputs:
1. **The selected sub-scenario** (carries its own signalPath + weight)
2. **The 5 user answers** (each carries a signalPath + weight from the chosen option)

It produces a `Recommendation` object displayed on the results screen.

---

### 6.1 Two Parallel Score Systems

The engine maintains **two independent score systems** simultaneously:

| Score System | Purpose | How Used |
|-------------|---------|----------|
| **Offering Scores** (`offeringTotals`) | Determines which IBM offering to recommend (Data, AI, AMM, DPDE) | `weight * signalMatrix[signalPath][offering]` — the signal matrix multiplier scales each weight into offering-specific scores |
| **Signal Path Scores** (`signalScores`) | Determines the primary technical recommendation within the offering | Raw weight accumulation per signal path (no matrix multiplication) |

**Key distinction:** Offering scores use the matrix multipliers. Signal path scores are simply the sum of raw weights.

---

### 6.2 Step-by-Step Process

#### Step 1: Initialize
```
offeringTotals = { Data: 0, AI: 0, AMM: 0, DPDE: 0 }
signalScores   = {}   // empty map of signalPath → accumulated weight
```

#### Step 2: Process sub-scenario base signal
The sub-scenario the user chose acts as a "base signal" that biases the recommendation before any questions are answered.

```
subMultipliers = signalMatrix[subScenario.signalPath]

For each offering in [Data, AI, AMM, DPDE]:
    offeringTotals[offering] += subScenario.weight * subMultipliers[offering]

signalScores[subScenario.signalPath] += subScenario.weight
```

#### Step 3: Process each of the 5 user answers
Each answer option the user clicked has a signalPath and weight (1-3).

```
For each answer in allAnswers:
    multipliers = signalMatrix[answer.signalPath]

    For each offering in [Data, AI, AMM, DPDE]:
        offeringTotals[offering] += answer.weight * multipliers[offering]

    signalScores[answer.signalPath] += answer.weight
```

#### Step 4: Rank offerings by total score (descending)
```
sortedOfferings = sort offeringTotals by score DESC
primaryOffering = sortedOfferings[0]  // e.g., { offering: "Data", score: 33 }
```

#### Step 5: Determine supporting & optional tiers
```
IF sortedOfferings[1].score >= primaryOffering.score * SUPPORTING_THRESHOLD (0.4)
   AND sortedOfferings[1].score >= MIN_SCORE_TO_DISPLAY (10)
THEN supportingOffering = sortedOfferings[1].offering

IF sortedOfferings[2].score >= primaryOffering.score * OPTIONAL_THRESHOLD (0.25)
   AND sortedOfferings[2].score >= MIN_SCORE_TO_DISPLAY (10)
THEN optionalOffering = sortedOfferings[2].offering
```

Both conditions must be true: the percentage threshold AND the minimum absolute score.

#### Step 6: Rank signal paths by accumulated score
```
sortedSignals = sort signalScores by score DESC
// Tie-breaker: sub-scenario's own signal path wins ties
primarySignalPath   = sortedSignals[0].signalPath
supportingSignalPath = sortedSignals[1].signalPath (if exists)
```

#### Step 7: Look up recommendation content
The primary signal path is used to find rich content from `scenario.signalPathMappings`:

```
primaryMapping = scenario.signalPathMappings.find(m => m.signalPath === primarySignalPath)
```

This mapping provides:
- `primaryRecommendation` — the headline recommendation title
- `description` — detailed description text
- `techStack` — technology components (e.g., ["Microsoft Fabric", "Azure Synapse", ...])
- `challenges` — customer pain points
- `solutions` — IBM solution descriptions
- `approach` — phased delivery approach
- `capabilities` — key capabilities
- `supportingCapability` — secondary capability name

#### Step 8: Resolve contextual content (fallback chain)
The engine tries to find journey-specific content before falling back to generic content:

```
contextKey = "${subScenarioId}:${primarySignalPath}"

1. FIRST TRY: contextualContent.entries[contextKey]     ← most specific (sub-scenario + signal)
2. FALLBACK:  primaryMapping.challenges/solutions/approach  ← signal-level content
3. LAST:      empty arrays []                             ← nothing found
```

#### Step 9: Inject answer modifiers
Answers with weight >= 3 (strongest signal) can inject additional challenges/solutions:

```
For each answer where answer.weight >= 3:
    modifier = contextualContent.answerModifiers[answer.optionId]
    IF modifier.challengeAppend exists AND not already in list:
        append to resolvedChallenges
    IF modifier.solutionAppend exists AND not already in list:
        append to resolvedSolutions
```

**Cap:** Maximum 5 challenges and 5 solutions (prevent visual overflow on screen).

#### Step 10: Calculate confidence percentage
```
totalScore = sum of all offering scores
confidence = min(round((primaryOfferingScore / totalScore) * 100), 95)
```
- Confidence is capped at **95%** to always indicate some uncertainty
- Default fallback is **70%** if totalScore is 0

#### Step 11: Assemble final Recommendation object
The complete `Recommendation` object sent to the results screen:

```typescript
{
  offeringGroup,              // "DT" | "AMM" | "DPDE"
  scenarioTitle,              // e.g., "Fragmented data and slow insights"
  subScenarioText,            // e.g., "Legacy data warehouse environment"
  primaryOffering,            // e.g., "Data"
  supportingOffering,         // e.g., "AI" (or undefined)
  optionalOffering,           // e.g., undefined
  offeringScores,             // [{offering: "Data", score: 33}, {offering: "AI", score: 14}, ...]
  primarySignalPath,          // e.g., "Data Platform Modernization"
  primaryRecommendation,      // e.g., "Legacy-to-Fabric Data Platform Modernization"
  primaryDescription,         // Long description text
  primaryTechStack,           // ["Microsoft Fabric", "Azure Data Factory", ...]
  supportingSignalPath,       // e.g., "Platform Consolidation"
  supportingCapability,       // e.g., "Unified Data Platform"
  supportingDescription,      // Description text
  confidence,                 // e.g., 68
  signalScores,               // [{signalPath: "Data Platform Modernization", score: 11}, ...]
  challenges,                 // ["Challenge 1", "Challenge 2", ...] (max 5)
  solutions,                  // ["Solution 1", "Solution 2", ...] (max 5)
  approach,                   // ["Phase 1: ...", "Phase 2: ...", ...]
  capabilities,               // ["Capability 1", "Capability 2", ...]
  ibmOffers,                  // [] (loaded separately by RecommendationScreen via useArtifacts)
}
```

---

### 6.3 Complete Worked Example

**User selects:**
- Scenario: `sc_fragmented_data` ("Fragmented data and slow insights")
- Sub-scenario: `sc1_sub1` ("Legacy data warehouse environment")
  - signalPath = "Data Platform Modernization", weight = 3

**Signal Matrix lookup for "Data Platform Modernization":** Data=3, AI=1, AMM=0, DPDE=0

**Step 2 — Sub-scenario base signal:**
| Offering | Calculation | Running Total |
|----------|------------|---------------|
| Data | 0 + (3 * 3) = 9 | **9** |
| AI | 0 + (3 * 1) = 3 | **3** |
| AMM | 0 + (3 * 0) = 0 | **0** |
| DPDE | 0 + (3 * 0) = 0 | **0** |

Signal scores: `{ "Data Platform Modernization": 3 }`

**User answers all 5 questions:**

| Q# | User Picks | Signal Path | Weight | Matrix (D/AI/AMM/DPDE) |
|----|-----------|-------------|--------|----------------------|
| Q1 | Option A | Data Platform Modernization | 3 | 3/1/0/0 |
| Q2 | Option A | Data Platform Modernization | 3 | 3/1/0/0 |
| Q3 | Option B | Data Governance | 3 | 2/2/0/0 |
| Q4 | Option C | Platform Consolidation | 3 | 3/1/0/0 |
| Q5 | Option A | Data Platform Modernization | 3 | 3/1/0/0 |

**Step 3 — Process each answer:**

| Step | Signal Path | W | Data calc | AI calc | AMM | DPDE |
|------|------------|---|-----------|---------|-----|------|
| Base | Data Platform Modernization | 3 | +9 | +3 | +0 | +0 |
| Q1 | Data Platform Modernization | 3 | +9 | +3 | +0 | +0 |
| Q2 | Data Platform Modernization | 3 | +9 | +3 | +0 | +0 |
| Q3 | Data Governance | 3 | +6 | +6 | +0 | +0 |
| Q4 | Platform Consolidation | 3 | +9 | +3 | +0 | +0 |
| Q5 | Data Platform Modernization | 3 | +9 | +3 | +0 | +0 |
| **TOTAL** | | | **51** | **21** | **0** | **0** |

Signal scores: `{ "Data Platform Modernization": 15, "Data Governance": 3, "Platform Consolidation": 3 }`

**Step 4 — Rank offerings:**
1. Data = 51 (Primary)
2. AI = 21
3. AMM = 0
4. DPDE = 0

**Step 5 — Tier determination:**
- Supporting check: AI (21) >= 51 * 0.4 (20.4)? **YES** ✓ AND 21 >= 10? **YES** ✓ → **AI = Supporting**
- Optional check: AMM (0) >= 51 * 0.25 (12.75)? **NO** ✗ → No optional offering

**Step 6 — Primary signal:** "Data Platform Modernization" (score 15)

**Step 8 — Contextual content lookup:**
- Key: `"sc1_sub1:Data Platform Modernization"`
- If found in `contextualContent.json` → use journey-specific challenges/solutions
- If not → fall back to `signalPathMappings` for "Data Platform Modernization"

**Step 10 — Confidence:**
```
confidence = min(round((51 / 72) * 100), 95) = min(71, 95) = 71%
```

**Final Result displayed on screen:**
- **Primary Offering:** Data Transformation (score: 51)
- **Supporting Offering:** AI Integration (score: 21)
- **Confidence:** 71%
- **Recommendation:** "Legacy-to-Fabric Data Platform Modernization"
- **Challenges:** 3-5 bullet points about legacy data pain
- **Solutions:** 3-5 bullet points about IBM + Microsoft solution
- **Approach:** Phased delivery plan
- **Tech Stack:** Microsoft Fabric, Azure Data Factory, etc.

---

### 6.4 How Answers Influence the Outcome

The scoring system creates a **tension between offerings** based on user answers:

| Answer Weight | Meaning | Impact |
|--------------|---------|--------|
| **Weight 1** | Mild signal | Small contribution to offering scores |
| **Weight 2** | Moderate signal | Medium contribution |
| **Weight 3** | Strong signal | Large contribution; also triggers answer modifiers |

**How signal path choice matters:**
- If a user consistently picks options with "Data Platform Modernization" signal → Data offering score grows fast (multiplier = 3 for Data)
- If a user picks options with "AI-Ready Data Foundation" signal → AI offering gets boosted (multiplier = 3 for AI) while Data gets a small boost (multiplier = 1)
- Cross-domain signals like "Cloud-Native Transformation" (AMM=3, DPDE=2) can shift the recommendation toward AMM or DPDE

**The sub-scenario provides a strong starting bias** (weight 2-3), so the offering group tends to align with the scenario's domain. However, if the user answers heavily toward a different domain's signal paths, the recommendation can shift.

---

### 6.5 What Gets Displayed on the Recommendation Screen

The `RecommendationScreen` component receives the `Recommendation` object and renders:

| Section | Data Source | Description |
|---------|-----------|-------------|
| **Header Badge** | Static label | "Personalized Recommendation" |
| **Title** | Static label | "Your Transformation Path" |
| **Context** | `scenarioTitle` + `subScenarioText` | "For your challenge: [scenario] — [sub-scenario]" |
| **Primary Banner** | `primaryRecommendation` + `primaryDescription` | Gradient-bordered card with signal path badge |
| **Offering Score Cards** | `offeringScores[]` | 4 cards showing Data/AI/AMM/DPDE scores with Primary/Supporting/Optional badges |
| **Your Challenge** | `challenges[]` | Bullet list (max 5) with red/rose styling |
| **IBM + Microsoft Solution** | `solutions[]` | Bullet list (max 5) with green/emerald styling |
| **Delivery Approach** | `approach[]` | Numbered list with blue/indigo styling |
| **Key Capabilities** | `capabilities[]` | Tag pills with amber styling |
| **Technology Stack** | `primaryTechStack[]` | Tag pills with blue styling |
| **IBM Solution Details** | `ibmOffers[]` (from `useArtifacts`) | Carousel of videos, PDFs, architecture diagrams, tools |
| **Supporting Capability** | `supportingCapability` + `supportingDescription` | Secondary recommendation section |
| **Confidence** | `confidence` | Percentage shown on offering cards |

### 6.6 Configurable Thresholds (via Admin)

| Config Key | Default | Description |
|-----------|---------|-------------|
| `supportingThreshold` | 0.4 | 2nd offering must score >= 40% of primary to be "Supporting" |
| `optionalThreshold` | 0.25 | 3rd offering must score >= 25% of primary to be "Optional" |
| `minScoreToDisplay` | 10 | Minimum absolute score for any offering to appear as Supporting/Optional |

These thresholds can be adjusted in real-time via Admin mode. Lowering thresholds makes it easier for secondary offerings to appear; raising them makes recommendations more focused on a single offering.

---

## 7. Scenarios Overview

### Summary Table

| # | Scenario ID | Title | Offering Group | Icon | Sub-Scenarios |
|---|------------|-------|---------------|------|--------------|
| 1 | sc_fragmented_data | Fragmented data and slow insights | DT | Database | 4 |
| 2 | sc_ai_blocked | AI initiatives blocked by poor data readiness | DT | Bot | 4 |
| 3 | sc_legacy_apps | Legacy applications with outdated infrastructure | AMM | Clock | 4 |
| 4 | sc_cloud_perf | Cloud applications facing performance & cost challenges | AMM | TrendingUp | 4 |
| 5 | sc_hybrid_estate | Hybrid estate creating complexity & risk | AMM | Activity | 4 |
| 6 | sc_dev_productivity | Stalling Developer Efficiency & Velocity on Azure | DPDE | Rocket | 4 |
| 7 | sc_security_risk | Increased Security Threat & Inadequate risk management | DPDE | ShieldCheck | 4 |
| 8 | sc_product_evolution | Lack of Innovation and Speed of Delivery | DPDE | Zap | 4 |

### Sub-Scenarios Table

| Scenario | Sub-Scenario ID | Text | Signal Path | Weight |
|----------|----------------|------|-------------|--------|
| sc_fragmented_data | sc1_sub1 | Legacy data warehouse environment | Data Platform Modernization | 3 |
| sc_fragmented_data | sc1_sub2 | Hybrid fragmented data estate | Platform Consolidation | 3 |
| sc_fragmented_data | sc1_sub3 | High cost and duplicate pipelines | Platform Consolidation | 2 |
| sc_fragmented_data | sc1_sub4 | Need real-time analytics | Real-Time Analytics | 3 |
| sc_ai_blocked | sc2_sub1 | No unified data foundation | Platform Unification | 3 |
| sc_ai_blocked | sc2_sub2 | Governance and compliance gaps | Data Governance | 3 |
| sc_ai_blocked | sc2_sub3 | Isolated AI or analytics initiatives | Data Unification | 2 |
| sc_ai_blocked | sc2_sub4 | Need Copilot-ready enterprise data | AI-Ready Data Foundation | 3 |
| sc_legacy_apps | amm1_sub1 | Technical debt | App Modernization | 3 |
| sc_legacy_apps | amm1_sub2 | High operational costs | Cloud Optimization | 3 |
| sc_legacy_apps | amm1_sub3 | Limited scalability | Cloud-Native Transformation | 2 |
| sc_legacy_apps | amm1_sub4 | Slow release cycles | DevOps Modernization | 2 |
| sc_cloud_perf | amm2_sub1 | High cloud cost | Cloud Optimization | 3 |
| sc_cloud_perf | amm2_sub2 | Poor performance | Cloud-Native Transformation | 2 |
| sc_cloud_perf | amm2_sub3 | Security & governance gaps | DevSecOps Modernization | 2 |
| sc_cloud_perf | amm2_sub4 | Limited cloud-native adoption | Cloud-Native Transformation | 2 |
| sc_hybrid_estate | amm3_sub1 | Mixed infrastructure estate | App Modernization | 3 |
| sc_hybrid_estate | amm3_sub2 | Integration complexity | Integration Modernization | 3 |
| sc_hybrid_estate | amm3_sub3 | Inconsistent governance | DevSecOps Modernization | 2 |
| sc_hybrid_estate | amm3_sub4 | Limited modernization roadmap | Hybrid Modernization | 2 |
| sc_dev_productivity | dpde1_sub1 | Legacy development toolchain | Dev Platform Modernization | 3 |
| sc_dev_productivity | dpde1_sub2 | Manual testing and release processes | DevOps Modernization | 2 |
| sc_dev_productivity | dpde1_sub3 | Low developer productivity | AI Engineering | 3 |
| sc_dev_productivity | dpde1_sub4 | Need AI-assisted engineering | AI Engineering | 3 |
| sc_security_risk | dpde2_sub1 | Legacy security controls | DevSecOps Modernization | 3 |
| sc_security_risk | dpde2_sub2 | Compliance challenges | Compliance Modernization | 2 |
| sc_security_risk | dpde2_sub3 | Fragmented security tools | Security Platform Consolidation | 2 |
| sc_security_risk | dpde2_sub4 | Need DevSecOps adoption | DevSecOps Modernization | 3 |
| sc_product_evolution | dpde3_sub1 | Slow product release cycles | Product Modernization | 3 |
| sc_product_evolution | dpde3_sub2 | Poor customer experience | Experience Engineering | 2 |
| sc_product_evolution | dpde3_sub3 | Monolithic product architecture | Cloud-Native Engineering | 3 |
| sc_product_evolution | dpde3_sub4 | Need cloud-native digital products | Cloud-Native Engineering | 3 |

---

## 8. Complete Question Mapping Tables

> **Total: 8 scenarios x 4 sub-scenarios x 5 questions x 4 options = 160 questions, 640 options**

Each table below shows all questions for one scenario. Options are labeled A-D with their signal path and weight.

---

### 8.1 Scenario: sc_fragmented_data (DT)
**"Fragmented data and slow insights"**

#### Sub-Scenario: sc1_sub1 — Legacy data warehouse environment (Signal: Data Platform Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | Where does most of your critical business data reside today? | A | Primarily in on-premise legacy data warehouses | Data Platform Modernization | 3 |
| | | B | Mix of on-prem and multiple cloud platforms | Platform Consolidation | 3 |
| | | C | Multiple cloud analytics tools with no unified platform | Platform Rationalization | 2 |
| | | D | Mostly centralized modern cloud data platform | Platform Optimization | 1 |
| Q2 | How long does it typically take to generate critical business insights or reports? | A | Several days or weeks | Data Platform Modernization | 3 |
| | | B | One to two days | Data Platform Modernization | 2 |
| | | C | Within a few hours | Real-Time Analytics | 2 |
| | | D | Real-time or near real-time | Real-Time Analytics | 1 |
| Q3 | What is your biggest data challenge today? | A | Duplicate pipelines and high operational costs | Platform Consolidation | 3 |
| | | B | Data quality and trust issues | Data Governance | 3 |
| | | C | Slow performance and scaling issues | Data Platform Modernization | 2 |
| | | D | Inability to support real-time analytics | Real-Time Analytics | 3 |
| Q4 | What is your primary transformation goal? | A | Reduce cost and eliminate legacy tools | Data Platform Modernization | 3 |
| | | B | Enable faster, insight-driven decisions | Real-Time Analytics | 2 |
| | | C | Create a unified enterprise data platform | Platform Consolidation | 3 |
| | | D | Prepare data foundation for AI and Copilot | AI-Ready Data Foundation | 3 |
| Q5 | What type of data workloads are most critical to your business? | A | Batch reporting and legacy ETL pipelines | Data Platform Modernization | 3 |
| | | B | Mix of batch and real-time workloads | Data Platform Modernization | 2 |
| | | C | Real-time or event-driven analytics | Real-Time Analytics | 3 |
| | | D | Self-service BI and dashboards | BI Optimization | 1 |

#### Sub-Scenario: sc1_sub2 — Hybrid fragmented data estate (Signal: Platform Consolidation, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How many distinct data platforms or cloud environments does your organization currently operate? | A | 5+ platforms across on-prem, Azure, AWS, and other clouds | Platform Consolidation | 3 |
| | | B | 3-4 platforms with some data replication between them | Platform Consolidation | 2 |
| | | C | 2 platforms with manual data synchronization processes | Data Platform Modernization | 2 |
| | | D | Mostly consolidated but with a few legacy holdouts | BI Optimization | 1 |
| Q2 | What is the primary impact of data silos on your business teams? | A | Business units cannot access cross-functional data for decisions | Platform Consolidation | 3 |
| | | B | Conflicting reports from different data sources erode trust | Data Governance | 3 |
| | | C | IT spends excessive time manually integrating data across platforms | Data Platform Modernization | 2 |
| | | D | Analytics teams are delayed waiting for data from other systems | Real-Time Analytics | 1 |
| Q3 | How do you currently handle data movement between cloud and on-premise systems? | A | Manual exports and imports with no automated pipelines | Data Platform Modernization | 3 |
| | | B | Custom-built ETL scripts that require constant maintenance | Platform Consolidation | 2 |
| | | C | Third-party integration tools with limited scalability | Platform Consolidation | 2 |
| | | D | Partially automated with Azure Data Factory but gaps remain | AI-Ready Data Foundation | 1 |
| Q4 | What is your biggest barrier to unifying your data estate? | A | Too many legacy systems with incompatible formats | Data Platform Modernization | 3 |
| | | B | Organizational silos with different teams owning different platforms | Data Governance | 2 |
| | | C | Lack of a clear platform consolidation strategy | Platform Consolidation | 2 |
| | | D | Budget constraints preventing migration investments | BI Optimization | 1 |
| Q5 | How would you describe your target state for enterprise data unification? | A | Single unified lakehouse on Microsoft Fabric with OneLake | Platform Consolidation | 3 |
| | | B | Federated data mesh with centralized governance | Data Governance | 3 |
| | | C | Hybrid architecture with real-time sync between environments | Real-Time Analytics | 2 |
| | | D | AI-ready data platform enabling Copilot and advanced analytics | AI-Ready Data Foundation | 2 |

#### Sub-Scenario: sc1_sub3 — High cost and duplicate pipelines (Signal: Platform Consolidation, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How many duplicate or overlapping ETL pipelines exist in your data estate? | A | Significant duplication - multiple pipelines moving the same data | Platform Consolidation | 3 |
| | | B | Some duplication across teams but partially managed | Platform Consolidation | 2 |
| | | C | Pipelines are mostly unique but poorly optimized for cost | Data Platform Modernization | 2 |
| | | D | Minimal duplication but high licensing costs for legacy tools | BI Optimization | 1 |
| Q2 | What is the primary driver of high data infrastructure costs? | A | Running parallel platforms that serve overlapping purposes | Platform Consolidation | 3 |
| | | B | Legacy data warehouse licensing and maintenance fees | Data Platform Modernization | 3 |
| | | C | Excessive compute costs from unoptimized data processing | Real-Time Analytics | 2 |
| | | D | Storage costs growing due to data sprawl and lack of lifecycle policies | Data Governance | 1 |
| Q3 | How do you currently manage data pipeline lifecycle and optimization? | A | No centralized visibility - each team manages their own pipelines | Data Governance | 3 |
| | | B | Some monitoring but no automated optimization or deduplication | Platform Consolidation | 2 |
| | | C | Manual reviews conducted periodically but not systematically | Data Platform Modernization | 2 |
| | | D | Automated pipeline monitoring with alerts but no AI-driven optimization | AI-Ready Data Foundation | 1 |
| Q4 | What would have the biggest impact on reducing your data platform costs? | A | Consolidating to a single platform and eliminating redundant tools | Platform Consolidation | 3 |
| | | B | Migrating off expensive legacy data warehouse licenses | Data Platform Modernization | 3 |
| | | C | Implementing data lifecycle policies to reduce storage waste | Data Governance | 2 |
| | | D | Optimizing compute with auto-scaling and right-sizing | BI Optimization | 1 |
| Q5 | What is your primary goal for pipeline rationalization? | A | Eliminate 50%+ of duplicate pipelines within 12 months | Platform Consolidation | 3 |
| | | B | Reduce total data platform spend by 30% through consolidation | Data Platform Modernization | 2 |
| | | C | Standardize all pipelines on a single orchestration platform | Data Platform Modernization | 2 |
| | | D | Enable real-time processing to replace expensive batch jobs | Real-Time Analytics | 1 |

#### Sub-Scenario: sc1_sub4 — Need real-time analytics (Signal: Real-Time Analytics, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What types of business decisions require real-time or near-real-time data? | A | Operational decisions like supply chain, fraud detection, or IoT monitoring | Real-Time Analytics | 3 |
| | | B | Customer-facing experiences requiring instant personalization | AI-Ready Data Foundation | 2 |
| | | C | Executive dashboards needing current-day data instead of stale reports | BI Optimization | 2 |
| | | D | Compliance and risk monitoring requiring continuous data feeds | Data Governance | 1 |
| Q2 | What is your current data latency for critical business reporting? | A | 24+ hours - batch processes run overnight only | Real-Time Analytics | 3 |
| | | B | 4-8 hours - multiple batch windows throughout the day | Data Platform Modernization | 2 |
| | | C | 1-4 hours - near-real-time for some workloads | Real-Time Analytics | 2 |
| | | D | Under 1 hour for most workloads but need sub-second for specific use cases | AI-Ready Data Foundation | 1 |
| Q3 | Do you currently have any streaming or event-driven data architecture? | A | No - all data processing is batch-based | Real-Time Analytics | 3 |
| | | B | Limited streaming for one or two use cases only | Real-Time Analytics | 2 |
| | | C | Streaming exists but on a separate platform from analytics | Platform Consolidation | 2 |
| | | D | Streaming pipeline in place but needs optimization for scale | Data Platform Modernization | 1 |
| Q4 | What is your primary barrier to implementing real-time analytics? | A | Legacy architecture cannot support streaming data ingestion | Data Platform Modernization | 3 |
| | | B | Lack of expertise in event-driven and streaming technologies | Real-Time Analytics | 3 |
| | | C | Cost concerns about running always-on streaming infrastructure | Platform Consolidation | 2 |
| | | D | No clear business case identified for real-time use cases | BI Optimization | 1 |
| Q5 | What is your target state for real-time analytics? | A | End-to-end streaming pipeline with live operational dashboards | Real-Time Analytics | 3 |
| | | B | Event-driven architecture enabling automated business responses | Real-Time Analytics | 3 |
| | | C | Real-time data foundation powering AI and Copilot experiences | AI-Ready Data Foundation | 2 |
| | | D | Unified real-time and batch processing on a single platform | Data Platform Modernization | 2 |

---

### 8.2 Scenario: sc_ai_blocked (DT)
**"AI initiatives blocked by poor data readiness"**

#### Sub-Scenario: sc2_sub1 — No unified data foundation (Signal: Platform Unification, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What is your organization's current AI or Copilot maturity? | A | No AI or Copilot initiatives yet | AI-Ready Data Foundation | 3 |
| | | B | Small AI or GenAI pilots | Platform Unification | 2 |
| | | C | Isolated AI models across teams | Data Unification | 3 |
| | | D | Enterprise-scale AI adoption | AI Optimization | 1 |
| Q2 | Do you currently have a unified enterprise data platform? | A | No, data is spread across disconnected systems | Platform Unification | 3 |
| | | B | Partial consolidation, still fragmented | Platform Consolidation | 3 |
| | | C | Mostly in cloud but across multiple platforms | Platform Rationalization | 2 |
| | | D | Yes, unified data lakehouse exists | AI Optimization | 1 |
| Q3 | How would you describe the trust and quality of your enterprise data? | A | Low trust, frequent quality issues | Data Governance | 3 |
| | | B | Moderate trust with manual checks | Governance Modernization | 2 |
| | | C | Mostly trusted but siloed | Data Unification | 2 |
| | | D | Highly trusted and standardized | AI Optimization | 1 |
| Q4 | Do you have automated data governance, lineage, and compliance tracking? | A | No governance or lineage in place | Data Governance | 3 |
| | | B | Governance exists but mostly manual | Governance Modernization | 2 |
| | | C | Some automated governance and lineage | Governance Optimization | 1 |
| | | D | Fully automated governance and compliance | AI Optimization | 1 |
| Q5 | What is your primary AI or Copilot objective? | A | Enable Copilot across business functions | AI-Ready Data Foundation | 3 |
| | | B | Build predictive or ML models | AI Analytics Foundation | 3 |
| | | C | Automate decisions and workflows | Real-Time AI Foundation | 2 |
| | | D | Improve reporting and dashboards | BI Optimization | 1 |

#### Sub-Scenario: sc2_sub2 — Governance and compliance gaps (Signal: Data Governance, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How mature is your data governance framework today? | A | No formal governance - data policies are ad-hoc and undocumented | Data Governance | 3 |
| | | B | Basic policies exist but enforcement is manual and inconsistent | Data Governance | 2 |
| | | C | Governance tools deployed but not fully configured or adopted | Data Unification | 2 |
| | | D | Strong governance for structured data but gaps in unstructured data | AI-Ready Data Foundation | 1 |
| Q2 | What is your biggest compliance or regulatory concern with enterprise data? | A | Cannot trace data lineage for audit or regulatory requirements | Data Governance | 3 |
| | | B | Sensitive data is not properly classified or labeled | Data Governance | 3 |
| | | C | Multiple data copies with no control over which is authoritative | Platform Unification | 2 |
| | | D | Governance processes slow down data access for legitimate business use | BI Optimization | 1 |
| Q3 | How do you currently handle data quality validation across your organization? | A | No systematic data quality checks - issues discovered downstream | Data Governance | 3 |
| | | B | Manual quality reviews by data stewards on a periodic basis | Data Unification | 2 |
| | | C | Automated quality rules for some datasets but not enterprise-wide | AI-Ready Data Foundation | 2 |
| | | D | Comprehensive quality framework but needs AI-powered enrichment | AI Analytics Foundation | 1 |
| Q4 | What tools or platforms do you use for data governance today? | A | No dedicated governance tooling - spreadsheets and documentation only | Data Governance | 3 |
| | | B | Legacy governance tools not integrated with modern cloud platforms | Platform Unification | 2 |
| | | C | Microsoft Purview deployed but not fully configured or adopted | Data Governance | 2 |
| | | D | Multiple governance tools with no unified policy layer | AI-Ready Data Foundation | 1 |
| Q5 | What is your primary governance transformation goal? | A | Automated data lineage and classification across all data assets | Data Governance | 3 |
| | | B | Unified compliance framework meeting regulatory requirements | Data Governance | 3 |
| | | C | Data quality automation enabling trusted AI and analytics | AI-Ready Data Foundation | 2 |
| | | D | Self-service data access with embedded governance guardrails | BI Optimization | 1 |

#### Sub-Scenario: sc2_sub3 — Isolated AI or analytics initiatives (Signal: Data Unification, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How are AI and analytics initiatives currently organized in your enterprise? | A | Individual teams run isolated AI projects with their own data copies | Data Unification | 3 |
| | | B | Central analytics team exists but cannot access all business data | Platform Unification | 2 |
| | | C | Multiple BI tools producing conflicting insights across departments | AI Analytics Foundation | 2 |
| | | D | Analytics is mature but AI models are disconnected from production data | AI-Ready Data Foundation | 1 |
| Q2 | What prevents your AI models from delivering enterprise-wide value? | A | Models are trained on incomplete or siloed datasets | Data Unification | 3 |
| | | B | No unified data platform to serve AI models at scale | Platform Unification | 3 |
| | | C | Data quality issues causing unreliable model outputs | Data Governance | 2 |
| | | D | AI outputs are not integrated into business workflows | Real-Time AI Foundation | 1 |
| Q3 | How many different analytics or BI tools are in use across your organization? | A | 5+ tools with significant overlap in functionality | Data Unification | 3 |
| | | B | 3-4 tools being used by different business units | Platform Unification | 2 |
| | | C | 2 primary tools with plans to consolidate | AI Analytics Foundation | 2 |
| | | D | Mostly standardized but advanced analytics still disconnected | BI Optimization | 1 |
| Q4 | What is the biggest barrier to unifying your analytics and AI estate? | A | Data scattered across incompatible systems with no common model | Data Unification | 3 |
| | | B | Lack of a unified semantic layer connecting all data domains | AI Analytics Foundation | 2 |
| | | C | Organizational resistance to standardizing on a single platform | Platform Unification | 2 |
| | | D | Governance policies too restrictive for cross-team data sharing | Data Governance | 1 |
| Q5 | What is your target state for unified AI and analytics? | A | Single unified data platform powering all AI and BI workloads | Platform Unification | 3 |
| | | B | Enterprise AI foundation with models connected to governed data | AI-Ready Data Foundation | 3 |
| | | C | Real-time AI insights embedded into business applications | Real-Time AI Foundation | 2 |
| | | D | Self-service analytics with Copilot for all business users | BI Optimization | 2 |

#### Sub-Scenario: sc2_sub4 — Need Copilot-ready enterprise data (Signal: AI-Ready Data Foundation, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How prepared is your enterprise data for Microsoft Copilot adoption? | A | Not prepared - data is fragmented, ungoverned, and inconsistent | AI-Ready Data Foundation | 3 |
| | | B | Some data is clean but lacks semantic models for Copilot | AI Analytics Foundation | 2 |
| | | C | Governance is in place but data products are not AI-optimized | Data Governance | 2 |
| | | D | Mostly ready but need fine-tuning for specific Copilot use cases | BI Optimization | 1 |
| Q2 | What type of enterprise data would you prioritize for Copilot enablement? | A | Customer and sales data for Copilot in Dynamics 365 and CRM | AI-Ready Data Foundation | 3 |
| | | B | Financial and operational data for Copilot in Excel and Power BI | BI Optimization | 2 |
| | | C | Unstructured documents and knowledge bases for Microsoft 365 Copilot | Data Unification | 2 |
| | | D | Technical and engineering data for GitHub Copilot integration | Real-Time AI Foundation | 1 |
| Q3 | What is missing from your current data architecture to support enterprise AI? | A | No semantic layer connecting business context to raw data | AI-Ready Data Foundation | 3 |
| | | B | Data quality too low for reliable AI model training and inference | Data Governance | 3 |
| | | C | Data not unified in a single platform accessible to AI services | Platform Unification | 2 |
| | | D | Real-time data feeds not available for AI-driven decision making | Real-Time AI Foundation | 1 |
| Q4 | How do you plan to govern AI-generated content and outputs? | A | No AI governance framework exists today | Data Governance | 3 |
| | | B | Basic policies defined but no tooling to enforce them | AI-Ready Data Foundation | 2 |
| | | C | Using Purview for data governance but not yet extended to AI outputs | Data Governance | 2 |
| | | D | Mature data governance being extended to cover AI responsibly | AI Analytics Foundation | 1 |
| Q5 | What is your primary Copilot and AI transformation goal? | A | Build a Copilot-ready enterprise data platform on Microsoft Fabric | AI-Ready Data Foundation | 3 |
| | | B | Enable Copilot across Microsoft 365 with governed enterprise data | AI Analytics Foundation | 3 |
| | | C | Create a real-time AI foundation for intelligent automation | Real-Time AI Foundation | 2 |
| | | D | Deploy AI-powered analytics for self-service business intelligence | BI Optimization | 2 |

---

### 8.3 Scenario: sc_legacy_apps (AMM)
**"Legacy applications with outdated infrastructure"**

#### Sub-Scenario: amm1_sub1 — Technical debt (Signal: App Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What is your biggest technical debt challenge? | A | Aging platforms limiting functionality and slowing development | App Modernization | 3 |
| | | B | Outdated technology stack making talent attraction difficult | Cloud-Native Transformation | 2 |
| | | C | High maintenance cost but business case for modernization unclear | Cloud Optimization | 2 |
| | | D | Need AI modernization to remain competitive | AI Integration | 1 |
| Q2 | What is your application portfolio profile? | A | Mostly on-premise with minimal cloud adoption | App Modernization | 3 |
| | | B | Mix of on-prem and cloud but inconsistent patterns | Hybrid Modernization | 2 |
| | | C | Mostly cloud VMs but not cloud-native | Cloud Optimization | 2 |
| | | D | Cloud-native services in use but legacy remains | AI Integration | 1 |
| Q3 | How does aging infrastructure impact your business? | A | Frequent outages disrupting business operations | App Modernization | 3 |
| | | B | Slow time-to-market for new features and services | DevOps Modernization | 2 |
| | | C | High operational costs from legacy system maintenance | Cloud Optimization | 2 |
| | | D | Missing competitive capabilities from AI integration | AI Integration | 1 |
| Q4 | What capability would most accelerate your transformation? | A | Automated application assessment and migration planning | App Modernization | 3 |
| | | B | Refactoring platforms to cloud-native architecture | Cloud-Native Transformation | 2 |
| | | C | Building modern DevOps pipelines and infrastructure | DevOps Modernization | 2 |
| | | D | Embedding AI into modernized applications | AI Integration | 1 |
| Q5 | What is your primary modernization target? | A | Migrate and modernize all legacy applications to Azure | App Modernization | 3 |
| | | B | Decompose monoliths into cloud-native microservices | Cloud-Native Transformation | 2 |
| | | C | Optimize cloud costs and governance | Cloud Optimization | 2 |
| | | D | Build AI-integrated intelligent applications | AI Integration | 1 |

#### Sub-Scenario: amm1_sub2 — High operational costs (Signal: Cloud Optimization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What is your biggest cost driver today? | A | On-premise infrastructure and licensing | Cloud Optimization | 3 |
| | | B | Over-provisioned cloud resources | Cloud Optimization | 2 |
| | | C | High database and storage costs | Cloud-Native Transformation | 2 |
| | | D | Operational overhead from manual processes | DevOps Modernization | 1 |
| Q2 | How would moving to cloud reduce costs? | A | Eliminate on-premise infrastructure and licensing | Cloud Optimization | 3 |
| | | B | Reduce operational labor through automation | DevOps Modernization | 2 |
| | | C | Right-size resources with elastic scaling | Cloud Optimization | 2 |
| | | D | Consolidate into fewer managed services | Cloud-Native Transformation | 1 |
| Q3 | What is the biggest opportunity for cost optimization? | A | Migrate from licensed software to SaaS and cloud services | Cloud-Native Transformation | 2 |
| | | B | Replacing licensed software with cloud-native managed services | Cloud-Native Transformation | 2 |
| | | C | Implementing FinOps practices and cost governance | Cloud Optimization | 3 |
| | | D | Automating operations to reduce manual support overhead | DevOps Modernization | 1 |
| Q4 | What cost optimization strategy interests you most? | A | Aggressive migration to eliminate on-prem costs | Cloud Optimization | 3 |
| | | B | Reserved instances and commitment-based pricing | Cloud Optimization | 2 |
| | | C | Replacing licensed software with cloud-native managed services | Cloud-Native Transformation | 2 |
| | | D | Automating operations to reduce manual support overhead | DevOps Modernization | 1 |
| Q5 | What is your primary cost optimization goal for the next 12 months? | A | Reduce total infrastructure spend by 30%+ through cloud migration | App Modernization | 3 |
| | | B | Eliminate legacy licensing costs by moving to open-source or PaaS | Cloud Optimization | 2 |
| | | C | Implement FinOps with automated cost governance across all environments | Cloud Optimization | 2 |
| | | D | Modernize to serverless and containers to optimize compute costs | Cloud-Native Transformation | 1 |

#### Sub-Scenario: amm1_sub3 — Limited scalability (Signal: Cloud-Native Transformation, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How does your application architecture handle sudden increases in demand? | A | Cannot scale - fixed infrastructure leads to outages during peaks | Cloud-Native Transformation | 3 |
| | | B | Manual scaling by provisioning new VMs which takes hours or days | App Modernization | 2 |
| | | C | Auto-scaling configured but limited by monolithic architecture | Cloud-Native Transformation | 2 |
| | | D | Scales well for most workloads but specific services are bottlenecks | DevOps Modernization | 1 |
| Q2 | What is the primary architectural barrier to scaling your applications? | A | Monolithic applications that cannot be independently scaled | App Modernization | 3 |
| | | B | Database bottlenecks that limit overall application throughput | Cloud-Native Transformation | 3 |
| | | C | Tight coupling between services preventing horizontal scaling | Cloud-Native Transformation | 2 |
| | | D | Infrastructure automation gaps making scaling manual and slow | DevOps Modernization | 1 |
| Q3 | Have you adopted containerization or Kubernetes for any workloads? | A | No container adoption - all workloads run on VMs or bare metal | Cloud-Native Transformation | 3 |
| | | B | Experimenting with containers in development but not production | Cloud-Native Transformation | 2 |
| | | C | Some workloads containerized but no orchestration platform | App Modernization | 2 |
| | | D | Kubernetes in production for some services but need to expand | AI Integration | 1 |
| Q4 | How do you currently manage application performance and availability? | A | Reactive - issues discovered by users reporting problems | App Modernization | 3 |
| | | B | Basic monitoring with alerts but limited observability | DevOps Modernization | 2 |
| | | C | APM tools deployed but not integrated with auto-remediation | Cloud-Native Transformation | 2 |
| | | D | Full observability stack with plans for AI-driven operations | AI Integration | 1 |
| Q5 | What is your target architecture for application scalability? | A | Microservices on Kubernetes with auto-scaling and service mesh | Cloud-Native Transformation | 3 |
| | | B | Containerized applications on Azure Kubernetes Service | Cloud-Native Transformation | 3 |
| | | C | PaaS-first approach using Azure App Service and managed services | App Modernization | 2 |
| | | D | Serverless architecture for event-driven scalable workloads | AI Integration | 2 |

#### Sub-Scenario: amm1_sub4 — Slow release cycles (Signal: DevOps Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How frequently does your team deploy application changes to production? | A | Monthly or less - long manual release cycles | DevOps Modernization | 3 |
| | | B | Bi-weekly with significant manual testing and approval gates | DevOps Modernization | 2 |
| | | C | Weekly with some automation but manual steps remain | Cloud-Native Transformation | 2 |
| | | D | Multiple times per week but want to achieve continuous deployment | AI Integration | 1 |
| Q2 | What is the biggest bottleneck in your software release process? | A | Manual testing that takes days or weeks before each release | DevOps Modernization | 3 |
| | | B | Complex approval workflows with multiple handoffs between teams | DevOps Modernization | 3 |
| | | C | No automated CI/CD pipeline - builds and deployments are manual | App Modernization | 2 |
| | | D | Environment provisioning and configuration management delays | Cloud-Native Transformation | 1 |
| Q3 | How mature is your CI/CD pipeline today? | A | No CI/CD - all builds and deployments are manual | DevOps Modernization | 3 |
| | | B | CI exists but CD is manual with scripts and runbooks | DevOps Modernization | 2 |
| | | C | CI/CD in place but not standardized across all applications | App Modernization | 2 |
| | | D | Mature CI/CD but want AI-assisted testing and deployment | AI Integration | 1 |
| Q4 | How do you handle environment management for development, testing, and production? | A | Shared environments with manual configuration causing conflicts | DevOps Modernization | 3 |
| | | B | Separate environments but provisioning takes days | Cloud-Native Transformation | 2 |
| | | C | Infrastructure as Code for some environments but not all | Cloud-Native Transformation | 2 |
| | | D | Fully automated ephemeral environments for each PR | AI Integration | 1 |
| Q5 | What is your primary DevOps transformation goal? | A | Achieve daily deployments with fully automated CI/CD pipelines | DevOps Modernization | 3 |
| | | B | Reduce release cycle from months to weeks through automation | DevOps Modernization | 3 |
| | | C | Implement GitOps and Infrastructure as Code across all environments | Cloud-Native Transformation | 2 |
| | | D | Enable AI-assisted testing and intelligent deployment strategies | AI Integration | 2 |

---

### 8.4 Scenario: sc_cloud_perf (AMM)
**"Cloud applications facing performance & cost challenges"**

#### Sub-Scenario: amm2_sub1 — High cloud cost (Signal: Cloud Optimization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What is your primary cloud challenge? | A | High cost | Cloud Optimization | 3 |
| | | B | Performance bottlenecks | Cloud-Native Transformation | 3 |
| | | C | Governance gaps | DevSecOps Modernization | 2 |
| | | D | Limited automation | DevOps Modernization | 2 |
| Q2 | What architecture do you currently use? | A | Mostly VMs | Cloud Optimization | 2 |
| | | B | Partial containers | Cloud-Native Transformation | 2 |
| | | C | Fully containerized | Cloud-Native Optimization | 1 |
| | | D | Serverless / event-driven | Cloud-Native Optimization | 1 |
| Q3 | How is monitoring & governance managed? | A | Manual tracking | DevSecOps Modernization | 3 |
| | | B | Basic cloud tools | DevSecOps Modernization | 2 |
| | | C | Automated governance | DevSecOps Optimization | 1 |
| | | D | AI-driven monitoring | AI Integration | 2 |
| Q4 | What improvement are you seeking? | A | Reduce cloud spend | Cloud Optimization | 3 |
| | | B | Improve scalability | Cloud-Native Transformation | 3 |
| | | C | Improve deployment speed | DevOps Modernization | 3 |
| | | D | Add AI-driven automation | AI Integration | 3 |
| Q5 | What is your future target state? | A | Optimized cloud operations | Cloud Optimization | 3 |
| | | B | Cloud-native microservices | Cloud-Native Transformation | 3 |
| | | C | Fully automated DevSecOps | DevSecOps Modernization | 3 |
| | | D | AI-driven cloud platform | AI Integration | 3 |

#### Sub-Scenario: amm2_sub2 — Poor performance (Signal: Cloud-Native Transformation, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What performance issues are you experiencing with your cloud applications? | A | High latency on user-facing applications causing poor experience | Cloud-Native Transformation | 3 |
| | | B | Database queries timing out under load | Cloud-Native Transformation | 2 |
| | | C | Inconsistent performance with unpredictable spikes and degradation | Cloud Optimization | 2 |
| | | D | API response times too slow for real-time business requirements | DevOps Modernization | 1 |
| Q2 | What is the root cause of your cloud performance challenges? | A | Lift-and-shift migration without cloud-native optimization | Cloud-Native Transformation | 3 |
| | | B | Wrong-sized resources - either over or under-provisioned | Cloud Optimization | 3 |
| | | C | No auto-scaling configured for variable workloads | Cloud-Native Transformation | 2 |
| | | D | Monitoring gaps - cannot identify performance bottlenecks | DevSecOps Modernization | 1 |
| Q3 | How do you currently monitor and optimize application performance? | A | No application performance monitoring in place | DevSecOps Modernization | 3 |
| | | B | Basic Azure Monitor alerts but no deep application insights | Cloud Optimization | 2 |
| | | C | APM tools deployed but not driving optimization actions | Cloud-Native Transformation | 2 |
| | | D | Comprehensive observability but need AI-driven recommendations | AI Integration | 1 |
| Q4 | What scaling pattern does your application workload require? | A | Highly variable - traffic spikes unpredictably and needs instant scaling | Cloud-Native Transformation | 3 |
| | | B | Predictable daily patterns but current architecture cannot auto-scale | Cloud Optimization | 2 |
| | | C | Steady-state with occasional peaks during business events | Cloud-Native Transformation | 2 |
| | | D | Multi-region scaling for global users with low-latency requirements | DevOps Modernization | 1 |
| Q5 | What is your target state for cloud application performance? | A | Cloud-native architecture with auto-scaling and self-healing | Cloud-Native Transformation | 3 |
| | | B | Optimized resource utilization with AI-driven performance tuning | AI Integration | 3 |
| | | C | Right-sized infrastructure with continuous cost-performance balance | Cloud Optimization | 2 |
| | | D | Full observability with proactive performance management | DevSecOps Modernization | 2 |

#### Sub-Scenario: amm2_sub3 — Security & governance gaps (Signal: DevSecOps Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How do you manage security posture across your cloud environment? | A | No centralized cloud security management - handled per project | DevSecOps Modernization | 3 |
| | | B | Microsoft Defender deployed but not fully configured | DevSecOps Modernization | 2 |
| | | C | Security policies exist but enforcement is manual and inconsistent | Cloud Optimization | 2 |
| | | D | Good security but need automated compliance and governance | AI Integration | 1 |
| Q2 | What is your biggest cloud governance challenge? | A | No resource tagging, cost allocation, or policy enforcement | DevSecOps Modernization | 3 |
| | | B | Shadow IT and uncontrolled resource provisioning | Cloud Optimization | 3 |
| | | C | Compliance requirements not automatically validated | DevSecOps Modernization | 2 |
| | | D | Multi-cloud governance inconsistency | DevOps Modernization | 1 |
| Q3 | How are Azure policies and guardrails implemented today? | A | No Azure policies - teams provision resources without constraints | DevSecOps Modernization | 3 |
| | | B | Basic policies exist but are not enforced or audited | DevSecOps Modernization | 2 |
| | | C | Policies enforced for production but not dev/test environments | Cloud Optimization | 2 |
| | | D | Comprehensive policies but need AI-driven anomaly detection | AI Integration | 1 |
| Q4 | How confident are you in meeting compliance and audit requirements? | A | Not confident - no automated compliance evidence or reporting | DevSecOps Modernization | 3 |
| | | B | Partially compliant but rely on manual evidence collection | DevOps Modernization | 2 |
| | | C | Compliant for most frameworks but gaps in newer cloud services | Cloud Optimization | 2 |
| | | D | Strong compliance posture seeking continuous automation | AI Integration | 1 |
| Q5 | What is your primary cloud security and governance goal? | A | Implement automated security posture management with Defender for Cloud | DevSecOps Modernization | 3 |
| | | B | Deploy Azure Policy guardrails with continuous compliance monitoring | DevSecOps Modernization | 3 |
| | | C | Achieve security-by-design with DevSecOps integrated pipelines | DevOps Modernization | 2 |
| | | D | Enable AI-driven threat detection and automated response | AI Integration | 2 |

#### Sub-Scenario: amm2_sub4 — Limited cloud-native adoption (Signal: Cloud-Native Transformation, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What percentage of your cloud workloads run on VMs versus cloud-native services? | A | Over 80% on VMs - minimal cloud-native adoption | Cloud-Native Transformation | 3 |
| | | B | 60-80% on VMs with some PaaS services adopted | Cloud Optimization | 2 |
| | | C | 40-60% on VMs - actively migrating to containers and PaaS | Cloud-Native Transformation | 2 |
| | | D | Under 40% on VMs - mostly cloud-native but need optimization | AI Integration | 1 |
| Q2 | What is the biggest barrier to adopting cloud-native services? | A | Skills gap - team lacks container and Kubernetes expertise | Cloud-Native Transformation | 3 |
| | | B | Application architecture too tightly coupled for microservices | Cloud-Native Transformation | 3 |
| | | C | Concern about vendor lock-in with managed cloud services | Cloud Optimization | 2 |
| | | D | Lack of CI/CD and automation to support cloud-native delivery | DevOps Modernization | 1 |
| Q3 | Which cloud-native capabilities are you most interested in adopting? | A | Containers and Kubernetes (AKS) for workload portability | Cloud-Native Transformation | 3 |
| | | B | Serverless computing (Azure Functions) for event-driven workloads | Cloud-Native Transformation | 2 |
| | | C | Managed databases and PaaS to reduce operational overhead | Cloud Optimization | 2 |
| | | D | AI services integrated into cloud-native applications | AI Integration | 1 |
| Q4 | How do you plan to handle the transition from VMs to cloud-native? | A | Phased approach - containerize critical apps first, then expand | Cloud-Native Transformation | 3 |
| | | B | New applications cloud-native only, legacy stays on VMs | Cloud Optimization | 2 |
| | | C | Full replatforming initiative across the portfolio | Cloud-Native Transformation | 2 |
| | | D | Start with DevOps maturity before moving to cloud-native architecture | DevOps Modernization | 1 |
| Q5 | What is your target cloud-native adoption goal? | A | 70%+ workloads on containers or serverless within 18 months | Cloud-Native Transformation | 3 |
| | | B | Standardize on AKS with GitOps-driven deployment model | DevOps Modernization | 2 |
| | | C | Achieve 40% cost reduction through cloud-native optimization | Cloud Optimization | 2 |
| | | D | Build AI-integrated cloud-native applications | AI Integration | 1 |

---

### 8.5 Scenario: sc_hybrid_estate (AMM)
**"Hybrid estate creating complexity & risk"**

#### Sub-Scenario: amm3_sub1 — Mixed infrastructure estate (Signal: App Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | Where are your critical applications currently hosted? | A | Mostly on-prem | App Modernization | 3 |
| | | B | Even split between on-prem and Azure | Hybrid Modernization | 3 |
| | | C | Mostly Azure VMs | Cloud Optimization | 2 |
| | | D | Cloud-native Azure services | Cloud-Native Optimization | 1 |
| Q2 | How are applications integrated across environments? | A | Manual / custom integrations | Integration Modernization | 3 |
| | | B | API-based but inconsistent | API Modernization | 2 |
| | | C | Standardized API gateway | API Optimization | 1 |
| | | D | Event-driven integration | Cloud-Native Transformation | 2 |
| Q3 | How is governance managed across hybrid estate? | A | Separate governance models | DevSecOps Modernization | 3 |
| | | B | Partial centralized governance | DevSecOps Modernization | 2 |
| | | C | Unified governance in Azure | DevSecOps Optimization | 1 |
| | | D | AI-assisted governance | AI Integration | 2 |
| Q4 | What is your biggest hybrid challenge? | A | Operational complexity | Hybrid Modernization | 3 |
| | | B | High integration cost | Integration Modernization | 2 |
| | | C | Inconsistent security posture | DevSecOps Modernization | 2 |
| | | D | Limited automation | DevOps Modernization | 2 |
| Q5 | What future state are you targeting? | A | Unified hybrid management | Hybrid Modernization | 3 |
| | | B | Cloud-native standardization | Cloud-Native Transformation | 3 |
| | | C | Automated DevSecOps | DevSecOps Modernization | 3 |
| | | D | AI-driven operations | AI Integration | 3 |

#### Sub-Scenario: amm3_sub2 — Integration complexity (Signal: Integration Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How are your on-premise and cloud applications currently integrated? | A | Point-to-point custom integrations with no standard patterns | Integration Modernization | 3 |
| | | B | Middleware or ESB handling integrations but aging and hard to maintain | Integration Modernization | 2 |
| | | C | Some API-based integrations but no centralized API management | Cloud-Native Transformation | 2 |
| | | D | Azure API Management deployed but not covering all integration needs | DevOps Modernization | 1 |
| Q2 | What is the primary integration challenge across your hybrid estate? | A | Data synchronization between on-prem and cloud is unreliable | Integration Modernization | 3 |
| | | B | No standard API strategy - each team builds integrations differently | Integration Modernization | 3 |
| | | C | Legacy protocols and formats incompatible with modern cloud services | Hybrid Modernization | 2 |
| | | D | Security concerns with data flowing between environments | DevSecOps Modernization | 1 |
| Q3 | How many integration touchpoints exist between on-premise and cloud? | A | 50+ integration points with no documentation or visibility | Integration Modernization | 3 |
| | | B | 20-50 integration points partially documented | Integration Modernization | 2 |
| | | C | 10-20 managed integrations with some automation | Cloud-Native Transformation | 2 |
| | | D | Under 10 well-managed integrations seeking optimization | AI Integration | 1 |
| Q4 | What integration pattern would best serve your hybrid environment? | A | API-first architecture with centralized API Management gateway | Integration Modernization | 3 |
| | | B | Event-driven integration with message brokers and async patterns | Cloud-Native Transformation | 2 |
| | | C | Service mesh for secure service-to-service communication | DevSecOps Modernization | 2 |
| | | D | Hybrid connectivity with Azure Arc for unified management | Hybrid Modernization | 1 |
| Q5 | What is your primary integration modernization goal? | A | Replace point-to-point integrations with a managed API platform | Integration Modernization | 3 |
| | | B | Standardize integration patterns across all environments | Integration Modernization | 3 |
| | | C | Enable real-time event-driven integration between hybrid systems | Cloud-Native Transformation | 2 |
| | | D | Implement AI-driven integration monitoring and optimization | AI Integration | 2 |

#### Sub-Scenario: amm3_sub3 — Inconsistent governance (Signal: DevSecOps Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How consistent are security and compliance policies across hybrid environments? | A | Completely different policies for on-prem versus cloud | DevSecOps Modernization | 3 |
| | | B | Policies are similar in intent but enforcement tools differ significantly | DevSecOps Modernization | 2 |
| | | C | Azure policies enforced in cloud but no equivalent for on-prem | Hybrid Modernization | 2 |
| | | D | Working toward unified policies with Azure Arc but not complete | Cloud-Native Transformation | 1 |
| Q2 | How do you manage identity and access across hybrid environments? | A | Separate identity systems for on-prem and cloud with no federation | DevSecOps Modernization | 3 |
| | | B | Azure AD with some federation but gaps in legacy application access | Hybrid Modernization | 2 |
| | | C | Federated identity but inconsistent RBAC across environments | DevSecOps Modernization | 2 |
| | | D | Unified Entra ID with plans for zero-trust across all environments | AI Integration | 1 |
| Q3 | What is the biggest risk from inconsistent governance? | A | Compliance violations from unmonitored on-premise systems | DevSecOps Modernization | 3 |
| | | B | Security gaps at the boundary between on-prem and cloud | DevSecOps Modernization | 3 |
| | | C | Inability to provide unified audit trail across all environments | Hybrid Modernization | 2 |
| | | D | Resource sprawl due to lack of centralized provisioning governance | DevOps Modernization | 1 |
| Q4 | How do you envision unified governance across your hybrid estate? | A | Azure Arc extending Azure governance to all resources | Hybrid Modernization | 3 |
| | | B | Centralized policy engine with enforcement across all environments | DevSecOps Modernization | 3 |
| | | C | Unified monitoring and compliance dashboard for all workloads | DevOps Modernization | 2 |
| | | D | AI-driven governance with automated remediation | AI Integration | 2 |
| Q5 | What is your primary hybrid governance goal? | A | Implement consistent security policies across all environments with Azure Arc | Hybrid Modernization | 3 |
| | | B | Automate compliance monitoring and reporting across hybrid estate | DevSecOps Modernization | 3 |
| | | C | Establish unified identity and zero-trust framework | DevSecOps Modernization | 2 |
| | | D | Deploy AI-driven threat detection across all environments | AI Integration | 1 |

#### Sub-Scenario: amm3_sub4 — Limited modernization roadmap (Signal: Hybrid Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | Do you have a documented modernization roadmap for your hybrid estate? | A | No roadmap - modernization decisions are made ad-hoc | Hybrid Modernization | 3 |
| | | B | High-level strategy exists but no detailed execution plan | Hybrid Modernization | 2 |
| | | C | Roadmap for cloud migration but not hybrid modernization | Cloud-Native Transformation | 2 |
| | | D | Detailed roadmap exists but needs refresh based on new capabilities | DevOps Modernization | 1 |
| Q2 | How have you assessed which workloads to modernize, migrate, or retain? | A | No formal assessment - decisions based on urgency or budget | Hybrid Modernization | 3 |
| | | B | Basic assessment done years ago but not updated | Hybrid Modernization | 2 |
| | | C | Assessment completed for some workloads but not the full portfolio | Cloud-Native Transformation | 2 |
| | | D | Comprehensive assessment but struggling with prioritization | Integration Modernization | 1 |
| Q3 | What is preventing your organization from accelerating hybrid modernization? | A | Lack of clear business case and ROI analysis for modernization | Hybrid Modernization | 3 |
| | | B | Too many dependencies between systems making phased migration complex | Integration Modernization | 3 |
| | | C | Skills gap in cloud-native and modern architecture | Cloud-Native Transformation | 2 |
| | | D | Risk aversion - fear of disrupting critical business systems | DevSecOps Modernization | 1 |
| Q4 | What migration approach best fits your organization? | A | Phased waves - modernize highest-value workloads first | Hybrid Modernization | 3 |
| | | B | Rehost first for quick wins then refactor for optimization | Cloud-Native Transformation | 2 |
| | | C | Build new cloud-native while gradually retiring legacy | Cloud-Native Transformation | 2 |
| | | D | Unified hybrid management with Azure Arc before migration | DevOps Modernization | 1 |
| Q5 | What is your primary hybrid modernization roadmap goal? | A | Complete hybrid assessment and develop 18-month modernization roadmap | Hybrid Modernization | 3 |
| | | B | Migrate 50%+ of hybrid workloads to cloud-native within 2 years | Cloud-Native Transformation | 3 |
| | | C | Implement Azure Arc for unified management as modernization foundation | Hybrid Modernization | 2 |
| | | D | Build modernization factory with repeatable patterns and automation | DevOps Modernization | 2 |

---

### 8.6 Scenario: sc_dev_productivity (DPDE)
**"Stalling Developer Efficiency & Velocity on Azure"**

#### Sub-Scenario: dpde1_sub1 — Legacy development toolchain (Signal: Dev Platform Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How would you describe your current development environment? | A | Mostly legacy tools and manual processes | Dev Platform Modernization | 3 |
| | | B | Mix of legacy and modern tools | Platform Rationalization | 2 |
| | | C | Mostly modern DevOps toolchain | DevOps Optimization | 1 |
| | | D | Fully cloud-native engineering platform | AI Engineering Optimization | 1 |
| Q2 | How automated are your build, test, and release processes? | A | Mostly manual processes | DevOps Modernization | 3 |
| | | B | Partial automation in some stages | DevOps Modernization | 2 |
| | | C | Mostly automated CI/CD pipelines | DevOps Optimization | 1 |
| | | D | Fully automated with AI assistance | AI Engineering | 1 |
| Q3 | What is your biggest engineering productivity challenge? | A | Slow development cycles | Dev Platform Modernization | 3 |
| | | B | High defect rates and rework | Quality Engineering | 2 |
| | | C | Integration and release delays | DevOps Modernization | 2 |
| | | D | Lack of AI-assisted development | AI Engineering | 3 |
| Q4 | What is your primary transformation goal? | A | Accelerate development speed | Dev Platform Modernization | 3 |
| | | B | Improve quality and reduce defects | Quality Engineering | 2 |
| | | C | Automate pipelines and releases | DevOps Modernization | 3 |
| | | D | Enable AI-assisted engineering | AI Engineering | 3 |
| Q5 | What type of engineering model are you moving toward? | A | Traditional monolithic applications | Application Modernization | 3 |
| | | B | Hybrid monolith + microservices | Cloud-Native Transformation | 2 |
| | | C | Microservices and APIs | Cloud-Native Engineering | 2 |
| | | D | AI-driven and autonomous engineering | AI Engineering | 3 |

#### Sub-Scenario: dpde1_sub2 — Manual testing and release processes (Signal: DevOps Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How much of your testing process is automated today? | A | Under 20% - most testing is manual with test scripts and checklists | DevOps Modernization | 3 |
| | | B | 20-50% automated - unit tests exist but integration and E2E are manual | Quality Engineering | 2 |
| | | C | 50-80% automated but test maintenance is a significant burden | Quality Engineering | 2 |
| | | D | Over 80% automated but need AI-driven test generation and optimization | AI Engineering | 1 |
| Q2 | What is the biggest bottleneck in your release management process? | A | Manual regression testing takes days before each release | DevOps Modernization | 3 |
| | | B | Deployment scripts are fragile and require manual intervention | DevOps Modernization | 3 |
| | | C | Release approvals involve multiple teams and long wait times | Quality Engineering | 2 |
| | | D | No automated rollback capability so releases carry high risk | Cloud-Native Engineering | 1 |
| Q3 | How are test environments managed for your development teams? | A | Shared test environments causing conflicts and delays | DevOps Modernization | 3 |
| | | B | Manual environment setup taking hours or days | DevOps Modernization | 2 |
| | | C | Some automation but environments drift from production configuration | Quality Engineering | 2 |
| | | D | Automated provisioning exists but test data management is manual | AI Engineering | 1 |
| Q4 | What type of testing improvements would have the biggest impact? | A | Automated CI/CD pipeline with integrated test gates | DevOps Modernization | 3 |
| | | B | Automated regression and integration test suites | Quality Engineering | 3 |
| | | C | Performance and load testing automation | Quality Engineering | 2 |
| | | D | AI-generated test cases and intelligent test prioritization | AI Engineering | 1 |
| Q5 | What is your primary testing and release automation goal? | A | Achieve 80%+ test automation with continuous testing in CI/CD | DevOps Modernization | 3 |
| | | B | Implement quality engineering practices with shift-left testing | Quality Engineering | 2 |
| | | C | Build automated release pipelines with zero-downtime deployments | Cloud-Native Engineering | 2 |
| | | D | Deploy AI-powered testing with intelligent test generation | AI Engineering | 1 |

#### Sub-Scenario: dpde1_sub3 — Low developer productivity (Signal: AI Engineering, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What do your developers spend the most time on besides writing code? | A | Waiting for builds, environments, or approvals | Dev Platform Modernization | 3 |
| | | B | Debugging issues caused by poor tooling or environment inconsistency | Dev Platform Modernization | 2 |
| | | C | Writing boilerplate code and repetitive patterns | AI Engineering | 2 |
| | | D | Context-switching between too many disconnected tools | Quality Engineering | 1 |
| Q2 | How do you measure developer productivity today? | A | No productivity metrics - output is not measured systematically | Dev Platform Modernization | 3 |
| | | B | Basic metrics like lines of code or story points completed | DevOps Modernization | 2 |
| | | C | DORA metrics tracked but not consistently improving | Quality Engineering | 2 |
| | | D | Comprehensive metrics with developer experience surveys | AI Engineering | 1 |
| Q3 | What is the average time from code commit to production deployment? | A | Weeks or months - long manual pipelines and approval chains | DevOps Modernization | 3 |
| | | B | Days - automated CI but manual CD and approvals | DevOps Modernization | 2 |
| | | C | Hours - mostly automated but some manual gates remain | Dev Platform Modernization | 2 |
| | | D | Under an hour - but want to optimize for developer experience | AI Engineering | 1 |
| Q4 | How would you rate your developer inner loop experience? | A | Poor - slow builds, limited local testing, frequent environment issues | Dev Platform Modernization | 3 |
| | | B | Moderate - builds are okay but testing requires remote environments | Quality Engineering | 2 |
| | | C | Good but could benefit from AI-assisted coding and debugging | AI Engineering | 2 |
| | | D | Excellent - fast feedback loops with modern tooling | Cloud-Native Engineering | 1 |
| Q5 | What is your primary developer productivity goal? | A | Modernize dev platform to reduce friction and wait times by 50% | Dev Platform Modernization | 3 |
| | | B | Implement GitHub Copilot to accelerate coding and reduce boilerplate | AI Engineering | 3 |
| | | C | Establish DORA metrics and continuously improve engineering velocity | DevOps Modernization | 2 |
| | | D | Build an internal developer platform for self-service capabilities | Cloud-Native Engineering | 2 |

#### Sub-Scenario: dpde1_sub4 — Need AI-assisted engineering (Signal: AI Engineering, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | Has your organization adopted AI-assisted development tools like GitHub Copilot? | A | No - no AI development tools have been evaluated or adopted | AI Engineering | 3 |
| | | B | Piloting with a small group but no enterprise rollout | AI Engineering | 2 |
| | | C | Some teams using Copilot but no governance or best practices | Dev Platform Modernization | 2 |
| | | D | Enterprise Copilot deployed but utilization is low | Quality Engineering | 1 |
| Q2 | Where would AI-assisted engineering have the biggest impact? | A | Code generation and completion to reduce development time | AI Engineering | 3 |
| | | B | Automated code review and security vulnerability detection | Quality Engineering | 2 |
| | | C | AI-generated test cases and test automation | Quality Engineering | 2 |
| | | D | AI-driven documentation and knowledge management | Dev Platform Modernization | 1 |
| Q3 | What concerns does your organization have about AI-assisted development? | A | Code quality and reliability of AI-generated suggestions | Quality Engineering | 3 |
| | | B | Security risks from AI-generated code introducing vulnerabilities | AI Engineering | 2 |
| | | C | Intellectual property and licensing concerns | Dev Platform Modernization | 2 |
| | | D | Developer skill atrophy from over-reliance on AI tools | Cloud-Native Engineering | 1 |
| Q4 | How ready is your development infrastructure for AI-assisted engineering? | A | Not ready - need to modernize dev tools and platforms first | Dev Platform Modernization | 3 |
| | | B | Basic readiness - modern IDE and source control but no AI integration | AI Engineering | 2 |
| | | C | Good readiness - GitHub Enterprise with Copilot-compatible setup | AI Engineering | 2 |
| | | D | Fully ready - just need governance framework and rollout plan | DevOps Modernization | 1 |
| Q5 | What is your primary AI engineering transformation goal? | A | Enterprise GitHub Copilot rollout with governance and best practices | AI Engineering | 3 |
| | | B | AI-powered code review and security scanning in CI/CD pipelines | Quality Engineering | 2 |
| | | C | AI-driven testing with automated test generation and optimization | AI Engineering | 2 |
| | | D | Full AI engineering platform with Copilot, AI testing, and AI ops | Cloud-Native Engineering | 1 |

---

### 8.7 Scenario: sc_security_risk (DPDE)
**"Increased Security Threat & Inadequate risk management"**

#### Sub-Scenario: dpde2_sub1 — Legacy security controls (Signal: DevSecOps Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How is application security currently handled? | A | Mostly manual security reviews | DevSecOps Modernization | 3 |
| | | B | Partial automation with tools | DevSecOps Modernization | 2 |
| | | C | Integrated into CI/CD pipelines | DevSecOps Optimization | 1 |
| | | D | Fully automated with AI-driven security | AI-Driven Security | 1 |
| Q2 | How confident are you in your compliance posture? | A | Low confidence, frequent audit issues | Compliance Modernization | 3 |
| | | B | Moderate confidence with manual processes | Compliance Automation | 2 |
| | | C | Mostly automated compliance checks | Compliance Optimization | 1 |
| | | D | Fully automated continuous compliance | AI Compliance | 1 |
| Q3 | What is your biggest security challenge today? | A | Vulnerabilities discovered late in lifecycle | DevSecOps Modernization | 3 |
| | | B | Lack of unified security visibility | Security Platform Consolidation | 2 |
| | | C | Manual compliance processes | Compliance Modernization | 2 |
| | | D | Need AI-driven threat detection | AI-Driven Security | 3 |
| Q4 | Where do most security risks originate? | A | Legacy applications and codebases | App Modernization Security | 3 |
| | | B | Third-party dependencies | Supply Chain Security | 2 |
| | | C | Misconfigured cloud resources | Cloud Security Optimization | 2 |
| | | D | Unknown or emerging threats | AI-Driven Security | 3 |
| Q5 | What is your primary security transformation goal? | A | Reduce vulnerabilities and risks | DevSecOps Modernization | 3 |
| | | B | Achieve regulatory compliance | Compliance Modernization | 3 |
| | | C | Automate security across pipelines | DevSecOps Automation | 2 |
| | | D | Enable AI-driven security operations | AI-Driven Security | 3 |

#### Sub-Scenario: dpde2_sub2 — Compliance challenges (Signal: Compliance Modernization, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What regulatory frameworks must your software development process comply with? | A | Multiple frameworks (SOX, HIPAA, PCI-DSS, GDPR) with manual evidence collection | Compliance Modernization | 3 |
| | | B | Key industry regulations with partial automation of compliance checks | Compliance Modernization | 2 |
| | | C | Basic compliance requirements but growing regulatory pressure | DevSecOps Modernization | 2 |
| | | D | Strong compliance but need to extend to new cloud-native workloads | Cloud Security Optimization | 1 |
| Q2 | How do you currently gather and maintain audit evidence for compliance? | A | Entirely manual - screenshots, spreadsheets, and documentation | Compliance Modernization | 3 |
| | | B | Some automated reports but significant manual compilation required | Compliance Modernization | 2 |
| | | C | Automated compliance reports for cloud but gaps in application layer | Security Platform Consolidation | 2 |
| | | D | Mostly automated but need AI-driven continuous compliance | AI-Driven Security | 1 |
| Q3 | How confident are you that all code changes meet compliance requirements before deployment? | A | Not confident - compliance checks happen after deployment if at all | Compliance Modernization | 3 |
| | | B | Manual reviews catch some issues but process is slow and inconsistent | DevSecOps Modernization | 2 |
| | | C | Automated policy checks in CI/CD for some requirements | Compliance Modernization | 2 |
| | | D | Comprehensive policy-as-code but need continuous monitoring | Cloud Security Optimization | 1 |
| Q4 | What is your biggest compliance challenge in software delivery? | A | Cannot prove compliance posture in real-time to auditors | Compliance Modernization | 3 |
| | | B | Compliance requirements slow down development and release cycles | DevSecOps Modernization | 3 |
| | | C | Different compliance standards across cloud and on-premise systems | Security Platform Consolidation | 2 |
| | | D | Keeping up with changing regulations and their impact on code | AI-Driven Security | 1 |
| Q5 | What is your primary compliance transformation goal? | A | Implement policy-as-code for automated compliance enforcement in CI/CD | Compliance Modernization | 3 |
| | | B | Continuous compliance monitoring with real-time dashboards for auditors | Compliance Modernization | 3 |
| | | C | Unified compliance framework across all environments and applications | Security Platform Consolidation | 2 |
| | | D | AI-driven compliance with automated regulatory impact analysis | AI-Driven Security | 2 |

#### Sub-Scenario: dpde2_sub3 — Fragmented security tools (Signal: Security Platform Consolidation, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How many different security tools are currently used across your development and operations? | A | 10+ tools from different vendors with no integration between them | Security Platform Consolidation | 3 |
| | | B | 5-10 tools with some overlap and manual correlation of findings | Security Platform Consolidation | 2 |
| | | C | 3-5 tools with partial integration through custom scripts | DevSecOps Modernization | 2 |
| | | D | Mostly consolidated but need AI-driven unified threat detection | AI-Driven Security | 1 |
| Q2 | What is the primary impact of fragmented security tooling? | A | Security findings are missed because no single view of all vulnerabilities | Security Platform Consolidation | 3 |
| | | B | Alert fatigue from duplicate findings across multiple tools | Security Platform Consolidation | 3 |
| | | C | Slow incident response due to manual correlation across tools | DevSecOps Modernization | 2 |
| | | D | High total cost of ownership for multiple security subscriptions | Cloud Security Optimization | 1 |
| Q3 | Do you have a unified security dashboard across all applications and infrastructure? | A | No - each tool has its own dashboard with no aggregation | Security Platform Consolidation | 3 |
| | | B | SIEM deployed but not covering application security findings | Security Platform Consolidation | 2 |
| | | C | Partial unified view through Microsoft Sentinel with gaps | DevSecOps Modernization | 2 |
| | | D | Unified view exists but need AI-powered threat prioritization | AI-Driven Security | 1 |
| Q4 | What approach would best address your security tool fragmentation? | A | Consolidate to Microsoft Defender suite with Sentinel SIEM | Security Platform Consolidation | 3 |
| | | B | Integrate existing tools through a unified security orchestration layer | DevSecOps Modernization | 2 |
| | | C | Replace overlapping tools and standardize on fewer vendors | Cloud Security Optimization | 2 |
| | | D | Deploy AI-driven security platform for unified threat intelligence | AI-Driven Security | 1 |
| Q5 | What is your primary security platform consolidation goal? | A | Unified security platform with single pane of glass visibility | Security Platform Consolidation | 3 |
| | | B | Reduce security tool count by 50% while improving coverage | Security Platform Consolidation | 3 |
| | | C | Integrated security in CI/CD pipeline with unified findings | DevSecOps Modernization | 2 |
| | | D | AI-powered security operations with automated threat response | AI-Driven Security | 2 |

#### Sub-Scenario: dpde2_sub4 — Need DevSecOps adoption (Signal: DevSecOps Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How is security currently integrated into your software development lifecycle? | A | Security is a gate at the end - reviewed only before production release | DevSecOps Modernization | 3 |
| | | B | Some SAST tools run in CI but results are often ignored | DevSecOps Modernization | 2 |
| | | C | Security scanning in CI/CD but no automated policy enforcement | Compliance Modernization | 2 |
| | | D | Shift-left security embedded but need supply chain security | Cloud Security Optimization | 1 |
| Q2 | How do you manage open-source and third-party dependency vulnerabilities? | A | No systematic scanning of dependencies for vulnerabilities | DevSecOps Modernization | 3 |
| | | B | Periodic manual audits of key dependencies only | Security Platform Consolidation | 2 |
| | | C | Automated SCA scanning but no automated remediation workflow | DevSecOps Modernization | 2 |
| | | D | Full SBOM with automated vulnerability alerts and remediation | AI-Driven Security | 1 |
| Q3 | What is your biggest barrier to adopting DevSecOps practices? | A | Development teams see security as a blocker, not an enabler | DevSecOps Modernization | 3 |
| | | B | Security tools too slow and generate too many false positives | Security Platform Consolidation | 3 |
| | | C | No security champions or training for development teams | Compliance Modernization | 2 |
| | | D | Lack of executive sponsorship for DevSecOps transformation | Cloud Security Optimization | 1 |
| Q4 | How do you handle container and infrastructure security scanning? | A | No container or infrastructure-as-code security scanning | DevSecOps Modernization | 3 |
| | | B | Basic image scanning but no runtime protection or IaC scanning | DevSecOps Modernization | 2 |
| | | C | Image and IaC scanning in CI/CD but no runtime security | Cloud Security Optimization | 2 |
| | | D | Comprehensive container security seeking AI-driven optimization | AI-Driven Security | 1 |
| Q5 | What is your primary DevSecOps transformation goal? | A | Embed automated security scanning in every CI/CD pipeline | DevSecOps Modernization | 3 |
| | | B | Implement full software supply chain security with SBOM | DevSecOps Modernization | 3 |
| | | C | Automated vulnerability remediation with developer-friendly workflows | Security Platform Consolidation | 2 |
| | | D | AI-driven security with automated threat detection and response | AI-Driven Security | 2 |

---

### 8.8 Scenario: sc_product_evolution (DPDE)
**"Lack of Innovation and Speed of Delivery"**

#### Sub-Scenario: dpde3_sub1 — Slow product release cycles (Signal: Product Modernization, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How quickly can you launch new digital features? | A | Several months | Product Modernization | 3 |
| | | B | 1-3 months | Product Optimization | 2 |
| | | C | Weeks | Agile Engineering | 1 |
| | | D | Continuous releases | AI-Driven Engineering | 1 |
| Q2 | What is your current product architecture? | A | Monolithic applications | Application Modernization | 3 |
| | | B | Hybrid monolith + services | Cloud-Native Transformation | 2 |
| | | C | Microservices and APIs | Cloud-Native Engineering | 1 |
| | | D | Event-driven and AI-enabled | AI-Driven Product Engineering | 1 |
| Q3 | What is your biggest digital product challenge? | A | Slow innovation cycles | Product Modernization | 3 |
| | | B | Poor customer experience | Experience Engineering | 2 |
| | | C | Scalability and performance issues | Cloud-Native Engineering | 2 |
| | | D | Lack of AI-driven capabilities | AI-Driven Product Engineering | 3 |
| Q4 | How do you currently gather customer insights? | A | Manual or delayed feedback | Experience Modernization | 3 |
| | | B | Periodic analytics reviews | Experience Optimization | 2 |
| | | C | Real-time analytics dashboards | Real-Time Experience | 1 |
| | | D | AI-driven personalization | AI Experience Engineering | 3 |
| Q5 | What is your primary product transformation goal? | A | Faster time-to-market | Product Modernization | 3 |
| | | B | Better customer experience | Experience Engineering | 2 |
| | | C | Scalable cloud-native products | Cloud-Native Engineering | 3 |
| | | D | AI-driven digital products | AI-Driven Product Engineering | 3 |

#### Sub-Scenario: dpde3_sub2 — Poor customer experience (Signal: Experience Engineering, W:2)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How do you currently measure and track digital product customer experience? | A | No systematic CX measurement - rely on support tickets for feedback | Experience Engineering | 3 |
| | | B | Basic analytics (page views, bounce rates) without user journey tracking | Experience Engineering | 2 |
| | | C | User journey tracking exists but not connected to product decisions | Product Modernization | 2 |
| | | D | Real-time experience monitoring with plans for AI-driven personalization | AI-Driven Product Engineering | 1 |
| Q2 | What is the primary cause of poor customer experience in your digital products? | A | Slow performance and unreliable availability frustrating users | Cloud-Native Engineering | 3 |
| | | B | Outdated UI/UX that does not meet modern user expectations | Experience Engineering | 3 |
| | | C | No personalization - all users get the same generic experience | AI-Driven Product Engineering | 2 |
| | | D | Feature gaps compared to competitor products | Product Modernization | 1 |
| Q3 | How quickly can you incorporate customer feedback into product improvements? | A | Months - feedback goes through lengthy planning and release cycles | Product Modernization | 3 |
| | | B | Weeks - feedback is captured but product changes take time | Experience Engineering | 2 |
| | | C | Days - agile process but limited by architecture constraints | Cloud-Native Engineering | 2 |
| | | D | Near-real-time - A/B testing and feature flags enable rapid iteration | Real-Time Experience | 1 |
| Q4 | What customer experience capabilities do you most need to develop? | A | User journey analytics and experience monitoring | Experience Engineering | 3 |
| | | B | Real-time personalization and recommendation engines | Real-Time Experience | 2 |
| | | C | A/B testing and feature experimentation platform | Product Modernization | 2 |
| | | D | AI-driven customer insights and predictive experience optimization | AI-Driven Product Engineering | 1 |
| Q5 | What is your primary customer experience transformation goal? | A | Build comprehensive experience engineering practice with CX metrics | Experience Engineering | 3 |
| | | B | Implement real-time personalization across all digital touchpoints | Real-Time Experience | 3 |
| | | C | Redesign product UX based on data-driven customer journey insights | Experience Engineering | 2 |
| | | D | Deploy AI-driven customer experience with predictive optimization | AI-Driven Product Engineering | 2 |

#### Sub-Scenario: dpde3_sub3 — Monolithic product architecture (Signal: Cloud-Native Engineering, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | How would you describe your current digital product architecture? | A | Large monolithic application that is difficult to change or scale | Cloud-Native Engineering | 3 |
| | | B | Partially decomposed with some services extracted but core remains monolithic | Cloud-Native Engineering | 2 |
| | | C | Multiple applications with tight coupling and shared databases | Product Modernization | 2 |
| | | D | Moving toward microservices but need API strategy and governance | Experience Engineering | 1 |
| Q2 | What is the biggest limitation of your current product architecture? | A | Cannot deploy features independently - all changes require full release | Cloud-Native Engineering | 3 |
| | | B | Scaling the entire application to handle load in one component | Cloud-Native Engineering | 3 |
| | | C | Technology stack is outdated and limits use of modern capabilities | Product Modernization | 2 |
| | | D | Cannot integrate AI or real-time features into existing architecture | AI-Driven Product Engineering | 1 |
| Q3 | Have you adopted API-first design principles for your digital products? | A | No - products use direct database connections and tight integrations | Cloud-Native Engineering | 3 |
| | | B | Some APIs exist but no standard design or governance | Product Modernization | 2 |
| | | C | API-first for new features but legacy remains tightly coupled | Cloud-Native Engineering | 2 |
| | | D | API-first architecture with gateway but need experience layer optimization | Experience Engineering | 1 |
| Q4 | What modernization approach best fits your product architecture needs? | A | Strangler fig pattern - incrementally extract microservices from monolith | Cloud-Native Engineering | 3 |
| | | B | Full rebuild as cloud-native microservices on Kubernetes | Cloud-Native Engineering | 3 |
| | | C | API layer on top of existing systems as a transitional architecture | Product Modernization | 2 |
| | | D | Event-driven architecture with domain-driven design | Real-Time Experience | 2 |
| Q5 | What is your primary architecture modernization goal? | A | Decompose monolith into independently deployable microservices | Cloud-Native Engineering | 3 |
| | | B | API-first architecture enabling ecosystem and partner integrations | Product Modernization | 2 |
| | | C | Cloud-native architecture on Kubernetes with auto-scaling | Cloud-Native Engineering | 2 |
| | | D | AI-integrated product architecture with real-time capabilities | AI-Driven Product Engineering | 1 |

#### Sub-Scenario: dpde3_sub4 — Need cloud-native digital products (Signal: Cloud-Native Engineering, W:3)

| Q# | Question | Opt | Option Text | Signal Path | W |
|----|----------|-----|------------|-------------|---|
| Q1 | What is your organization readiness for building cloud-native digital products? | A | Not ready - still building on legacy infrastructure and frameworks | Cloud-Native Engineering | 3 |
| | | B | Some cloud services used but products are not designed cloud-native | Cloud-Native Engineering | 2 |
| | | C | Cloud-native principles adopted for some products but not standardized | Product Modernization | 2 |
| | | D | Cloud-native foundation in place - seeking AI and real-time capabilities | AI-Driven Product Engineering | 1 |
| Q2 | What cloud-native capabilities would most transform your digital products? | A | Serverless and event-driven architecture for scalable products | Cloud-Native Engineering | 3 |
| | | B | Containerized microservices with Kubernetes orchestration | Cloud-Native Engineering | 2 |
| | | C | AI and ML services embedded directly into product features | AI-Driven Product Engineering | 2 |
| | | D | Real-time data streaming for live product experiences | Real-Time Experience | 1 |
| Q3 | How do you plan to integrate AI capabilities into your digital products? | A | No plans yet - need to build cloud-native foundation first | Cloud-Native Engineering | 3 |
| | | B | Plan to use Azure AI services for specific product features | AI-Driven Product Engineering | 3 |
| | | C | Building custom ML models for product differentiation | AI-Driven Product Engineering | 2 |
| | | D | Integrating Copilot capabilities for AI-powered user experiences | Experience Engineering | 1 |
| Q4 | What is your biggest challenge in building modern digital products? | A | Legacy architecture preventing adoption of modern cloud-native patterns | Cloud-Native Engineering | 3 |
| | | B | Lack of product engineering culture focused on experimentation | Product Modernization | 2 |
| | | C | No real-time infrastructure for live, responsive product experiences | Real-Time Experience | 2 |
| | | D | Difficulty integrating AI into existing product workflows | AI-Driven Product Engineering | 1 |
| Q5 | What is your primary cloud-native product transformation goal? | A | Build cloud-native product platform on Kubernetes with serverless | Cloud-Native Engineering | 3 |
| | | B | Launch AI-powered digital product features using Azure AI services | AI-Driven Product Engineering | 3 |
| | | C | Build real-time personalized experiences with streaming architecture | Real-Time Experience | 2 |
| | | D | Establish modern product engineering practice with experimentation culture | Product Modernization | 2 |

---

## 9. Admin System

### How to Activate Admin Mode
1. **URL parameter:** Add `?admin=true` to the URL
2. **Keyboard shortcut:** `Ctrl+Shift+A`
3. **Triple-tap:** Tap the header logo area 3 times within 1 second

### Admin Capabilities
| Feature | Description |
|---------|-------------|
| **Edit Labels** | Double-click any text to inline-edit UI labels |
| **Edit Scenarios** | Modify scenario titles, descriptions, questions, options |
| **Edit Config** | Adjust numeric thresholds (idle timeout, scoring thresholds) |
| **Export** | Download current overrides as JSON file |
| **Import** | Load overrides from a JSON file |
| **Reset** | Clear all overrides, restore defaults (requires double-confirm) |
| **Change Tracking** | Badge shows count of modified fields |

### Storage
- **Key:** `navigator_admin_overrides` in `localStorage`
- **Format:** Nested JSON with sections: `labels`, `scenarios`, `signalMatrix`, `config`
- **Merge Strategy:** Deep merge — overrides are layered on top of defaults from `scenarios.json` and `labels.ts`

### Admin Context API (`AdminContext.tsx`)
```typescript
getLabel(key: string): string           // Get label with fallback to DEFAULT_LABELS
setLabel(key: string, value: string)    // Override a label
getScenarios(): Scenario[]              // Get merged scenarios (defaults + overrides)
getSignalMatrix(): SignalOfferingMapping[] // Get signal matrix
updateScenarioField(scenarioId, fieldPath, value) // Deep-merge scenario field
getConfig(key: string): number          // Get config with fallback to DEFAULT_CONFIG
setConfig(key: string, value: number)   // Override config value
exportConfig(): void                    // Download JSON
importConfig(file: File): Promise<void> // Load JSON
resetToDefaults(): void                 // Clear all overrides
handleTripleTap(): void                 // Toggle admin mode
hasChanges: boolean                     // Whether any overrides exist
changeCount: number                     // Total modified fields
```

### Deep Merge Logic
The `deepMergeScenario()` function handles:
1. **Simple fields** (title, description, etc.) — direct override
2. **subScenarios** — merge by sub-scenario ID, then deep-merge nested questions and options
3. **signalPathMappings** — merge by signalPath key
4. **questions within sub-scenarios** — merge by question ID
5. **options within questions** — merge by option ID

---

## 10. Contextual Content System

### File: `src/data/contextualContent.json` (1,498 lines)

### Purpose
Provides journey-specific challenges, solutions, and approach content that overrides the generic signal path mapping content in `scenarios.json`.

### Structure
```json
{
  "entries": {
    "subScenarioId:signalPath": {
      "challenges": ["Challenge 1", "Challenge 2", ...],
      "solutions": ["Solution 1", "Solution 2", ...],
      "approach": ["Phase 1...", "Phase 2...", ...]
    }
  },
  "answerModifiers": {
    "questionOptionId": {
      "challengeAppend": "Additional challenge text",
      "solutionAppend": "Additional solution text"
    }
  }
}
```

### Resolution Priority (Fallback Chain)
1. **Contextual Content** (`contextualContent.json` entries keyed by `subScenarioId:primarySignalPath`) — highest priority
2. **Signal Path Mapping** (from `scenarios.json` signalPathMappings) — fallback
3. **Empty arrays** — last resort

### Answer Modifiers
- Triggered for answers with weight >= 3 (strongest signal)
- Appends additional challenges/solutions to the recommendation
- Prevents duplicates (only appends if not already present)
- Results capped at 5 items per list to prevent visual overflow

---

## 11. Kiosk & Idle Timeout

### Kiosk Mode (`src/utils/kiosk.ts`)
Activated on mount in `App.tsx`. Prevents:
- Pinch-zoom (multi-touch gestures)
- Pull-to-refresh (overscroll bounce)
- Edge swipe navigation (back/forward)
- Context menu (long press)
- Text selection
- Keyboard shortcuts (Ctrl+/-, F5, F11, Ctrl+R, etc.)

Enables:
- Fullscreen mode
- Passive event listeners for performance

### Idle Timeout (`src/hooks/useIdleTimeout.ts`)

| Config | Default | Description |
|--------|---------|-------------|
| `idleTimeoutMs` | 120000 (2 min) | Time of inactivity before warning |
| `warningMs` | 15000 (15 sec) | Duration of warning countdown |
| `enabled` | true | Disabled on landing screen |

**Tracked Events:** touchstart, mousemove, keydown, pointerdown, scroll

**Flow:**
1. User is inactive for 2 minutes
2. Warning modal appears with countdown circle
3. User taps "Tap to Continue" → timer resets
4. If countdown reaches 0 → `reset()` called → back to Landing

---

## 12. Artifact System

### Dynamic Loading from Azure Blob Storage

**Hook:** `useArtifacts(offeringGroup)` in `src/hooks/useArtifacts.ts`

**Flow:**
1. Takes offering group (e.g., "DT", "AMM", "DPDE")
2. Fetches artifact manifest from Azure Blob Storage via `artifactService.ts`
3. Falls back to static manifest (`artifactManifest.ts`) if Blob Storage unavailable
4. Returns array of `IBMOffer` objects with media URLs
5. Caches results for 5 minutes (TTL)

### Artifact Types
| Type | File Formats | Display |
|------|-------------|---------|
| Video | MP4, WebM | Native video player with controls |
| Architecture | PNG, JPG | Image with zoom modal |
| Tool | PDF, PPTX, XLSX | DocumentCard with download button |
| Document | PDF | Embedded iframe |
| Demo | Various | Interactive demo link |

### Metadata Resolution Priority
1. `metadata.json` file in Blob Storage container
2. Blob custom metadata headers
3. Auto-derived from filename

### Environment Variable
```
VITE_ARTIFACT_BASE_URL=https://your-storage-account.blob.core.windows.net
```

---

## 13. Components Reference

### Navigator Components

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| LandingScreen | `navigator/LandingScreen.tsx` | ~125 | Welcome screen with CTA button |
| ScenarioSelector | `navigator/ScenarioSelector.tsx` | ~257 | 8 scenario cards grouped by offering |
| SubScenarioSelector | `navigator/SubScenarioSelector.tsx` | ~164 | 4 sub-scenario cards per scenario |
| QuestionFlow | `navigator/QuestionFlow.tsx` | ~221 | Question display with 4 option buttons |
| RecommendationScreen | `navigator/RecommendationScreen.tsx` | ~705 | Full results page with artifacts |
| IdleWarningModal | `navigator/IdleWarningModal.tsx` | ~106 | Timeout warning with countdown |
| NavigatorLayout | `navigator/NavigatorLayout.tsx` | ~93 | Header/footer layout wrapper |
| DocumentCard | `navigator/DocumentCard.tsx` | ~80 | Office file card (PPTX/XLSX/PDF) |
| ZoomableMediaModal | `navigator/ZoomableMediaModal.tsx` | ~319 | Full-screen media viewer with zoom |

### Admin Components

| Component | File | Purpose |
|-----------|------|---------|
| AdminToolbar | `admin/AdminToolbar.tsx` | Floating admin panel (bottom-right) |
| EditableText | `admin/EditableText.tsx` | Inline text editor (double-click to edit) |
| EditableList | `admin/EditableList.tsx` | List management with add/delete |

### Visualization Components

| Component | File | Screen |
|-----------|------|--------|
| AnimatedBackground | `visualizations/AnimatedBackground.tsx` | All screens (variant selector) |
| HeroConstellation | `variants/HeroConstellation.tsx` | Landing |
| FlowStreams | `variants/FlowStreams.tsx` | Scenario Selection |
| ConvergeFocus | `variants/ConvergeFocus.tsx` | Sub-Scenario Selection |
| PulseOrbs | `variants/PulseOrbs.tsx` | Questions |
| RevealPremium | `variants/RevealPremium.tsx` | Recommendation |

### Animation Patterns
- **Page transitions:** Framer Motion `AnimatePresence mode="wait"`
- **Landing:** Opacity fade (0.3s)
- **Scenario/SubScenario:** Y-slide + opacity (0.35s, easeOut)
- **Questions:** X-slide + opacity (0.35s, easeOut)
- **Results:** Scale + opacity (0.4s, easeOut)
- **Button taps:** `whileTap={{ scale: 0.96-0.98 }}`

---

## 14. Configuration & Labels

### Default Labels (`src/data/labels.ts`)

| Key | Default Value |
|-----|--------------|
| `landing.heading` | Digital Transformation Navigator |
| `landing.subtitle` | Discover your transformation path with IBM + Microsoft |
| `landing.attribution` | Powered by IBM Consulting |
| `landing.cta` | Begin Your Journey |
| `landing.trustLine` | Trusted by global enterprises modernizing with Microsoft and IBM |
| `scenario.heading` | What best describes your current challenge? |
| `scenario.subheading` | Select the scenario that resonates most with your current state |
| `scenario.group.DT` | Data Transformation |
| `scenario.group.AMM` | App Modernization |
| `scenario.group.DPDE` | Product Engineering |
| `subscenario.heading` | Tell us more.. |
| `subscenario.subheading` | Select one of the most critical problem areas that best matches your current state |
| `question.backToSub` | Back to sub-scenarios |
| `question.backPrevious` | Previous question |
| `results.badge` | Personalized Recommendation |
| `results.heading` | Your Transformation Path |
| `results.badgePrimary` | Primary |
| `results.badgeSupporting` | Supporting |
| `results.badgeOptional` | Optional |
| `results.yourChallenge` | Your Challenge |
| `results.ibmSolution` | IBM + Microsoft Solution |
| `results.deliveryApproach` | Delivery Approach |
| `results.keyCapabilities` | Key Capabilities |
| `results.techStack` | Technology Stack |
| `results.whatIbmOffers` | IBM'S Solution details |
| `results.startOver` | Start Over |
| `results.offeringLabel.Data` | Data Transformation |
| `results.offeringLabel.AI` | AI Integration |
| `results.offeringLabel.AMM` | Application Migration & Modernization |
| `results.offeringLabel.DPDE` | Digital Product Design & Engineering |
| `idle.title` | Still exploring? |
| `idle.subtitle` | This session will reset in |
| `idle.cta` | Tap to Continue |
| `layout.location` | Bangalore |
| `layout.date` | March 8, 2026 |

### Default Config (`src/data/labels.ts`)

| Key | Default | Description |
|-----|---------|-------------|
| `idleTimeoutMs` | 120000 | 2 minutes before idle warning |
| `warningMs` | 15000 | 15 seconds warning countdown |
| `supportingThreshold` | 0.4 | 40% of primary = supporting tier |
| `optionalThreshold` | 0.25 | 25% of primary = optional tier |
| `minScoreToDisplay` | 10 | Minimum score to show offering |
| `backgroundMode` | 0 | 0 = static images, 1 = force static |

---

## Quick Statistics

| Metric | Count |
|--------|-------|
| Total Scenarios | 8 |
| Total Sub-Scenarios | 32 |
| Total Questions | 160 |
| Total Answer Options | 640 |
| Unique Signal Paths | 55 |
| Offering Categories | 4 (Data, AI, AMM, DPDE) |
| Components | ~20 |
| Hooks | 4 |
| Total Data Lines (scenarios.json) | 9,077 |
| Total Data Lines (contextualContent.json) | 1,498 |

---

*Generated from source code analysis of the MicrosoftNavigator project.*
