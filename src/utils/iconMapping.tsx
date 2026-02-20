import React from 'react';
import {
  DataBase,
  DataRefinery,
  Locked,
  DataEnrichment,
  Branch,
  DataClass,
  CheckmarkOutline,
  Activity,
  Bot,
  Migrate,
  Cloud,
  ContainerSoftware,
  Network_3,
  Renew,
  Api,
  Growth,
  Currency,
  SettingsAdjust,
  Dashboard,
  ChartLine,
  ChartMultiLine,
  Security,
  Apps,
  CodeReference,
  Report,
  Lightning,
  Chip,
  Rocket,
} from '@carbon/icons-react';

// --- Capability keyword rules (first match wins) ---

interface IconRule {
  keywords: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CAPABILITY_RULES: IconRule[] = [
  { keywords: ['warehouse', 'lakehouse'], icon: DataBase },
  { keywords: ['data pipeline', 'pipeline engineering'], icon: DataRefinery },
  { keywords: ['data governance', 'governance'], icon: Locked },
  { keywords: ['data integration', 'unification'], icon: DataEnrichment },
  { keywords: ['data lineage'], icon: Branch },
  { keywords: ['data classification'], icon: DataClass },
  { keywords: ['data quality', 'quality monitoring'], icon: CheckmarkOutline },
  { keywords: ['streaming', 'real-time', 'event-driven'], icon: Activity },
  { keywords: ['ai', 'copilot', 'genai', 'machine learning'], icon: Bot },
  { keywords: ['migration', 'migrate'], icon: Migrate },
  { keywords: ['cloud'], icon: Cloud },
  { keywords: ['container', 'kubernetes', 'docker'], icon: ContainerSoftware },
  { keywords: ['microservice'], icon: Network_3 },
  { keywords: ['app modernization', 'application modernization'], icon: Renew },
  { keywords: ['api'], icon: Api },
  { keywords: ['devops', 'ci/cd'], icon: Branch },
  { keywords: ['performance', 'optimization', 'optimize'], icon: Growth },
  { keywords: ['cost', 'finops'], icon: Currency },
  { keywords: ['automation', 'automated'], icon: SettingsAdjust },
  { keywords: ['dashboard', 'bi ', 'self-service'], icon: Dashboard },
  { keywords: ['analytics', 'insight'], icon: ChartLine },
  { keywords: ['kpi', 'metric'], icon: ChartMultiLine },
  { keywords: ['security', 'threat'], icon: Security },
  { keywords: ['compliance', 'compliant'], icon: Locked },
  { keywords: ['design', 'ux', 'experience'], icon: Apps },
  { keywords: ['software', 'development', 'engineering'], icon: CodeReference },
  { keywords: ['strategy', 'framework', 'roadmap'], icon: Report },
  { keywords: ['platform', 'consolidation'], icon: Apps },
];

const TECH_STACK_RULES: IconRule[] = [
  { keywords: ['fabric'], icon: DataBase },
  { keywords: ['synapse'], icon: ChartLine },
  { keywords: ['power bi'], icon: Dashboard },
  { keywords: ['purview'], icon: Locked },
  { keywords: ['openai', 'copilot', 'azure openai'], icon: Bot },
  { keywords: ['azure data factory'], icon: DataRefinery },
  { keywords: ['azure event hub', 'stream analytics'], icon: Activity },
  { keywords: ['azure migrate'], icon: Migrate },
  { keywords: ['azure devops'], icon: Branch },
  { keywords: ['azure kubernetes', 'aks'], icon: ContainerSoftware },
  { keywords: ['azure policy'], icon: Locked },
  { keywords: ['azure'], icon: Cloud },
  { keywords: ['microsoft defender'], icon: Security },
  { keywords: ['ibm data platform genius', 'ibm genai'], icon: Bot },
  { keywords: ['ibm'], icon: Rocket },
  { keywords: ['kubernetes'], icon: ContainerSoftware },
  { keywords: ['docker'], icon: ContainerSoftware },
  { keywords: ['terraform'], icon: CodeReference },
  { keywords: ['github'], icon: Branch },
];

function matchIcon(text: string, rules: IconRule[], fallback: IconRule['icon']): React.ComponentType<{ size?: number; className?: string }> {
  const lower = text.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.icon;
    }
  }
  return fallback;
}

export function getCapabilityIcon(text: string, size = 14): React.ReactElement {
  const Icon = matchIcon(text, CAPABILITY_RULES, Lightning);
  return <Icon size={size} />;
}

export function getTechStackIcon(text: string, size = 14): React.ReactElement {
  const Icon = matchIcon(text, TECH_STACK_RULES, Chip);
  return <Icon size={size} />;
}
