/**
 * Static manifest mapping offering groups to their artifact files.
 * Files live in public/Artifacts/{DT,AMM,DPDE}-Artifacts/{video,architecture,tools}/
 * Paths are relative to public/ (served as absolute URLs by Vite).
 *
 * NOTE: File names with spaces / special chars are encodeURI'd at usage time.
 */

export interface ArtifactFile {
  fileName: string;
  path: string;
  fileType: 'mp4' | 'png' | 'pdf' | 'pptx' | 'xlsx' | 'jpg';
  title: string;
  description: string;
  fileSize?: string;
}

export interface OfferingArtifacts {
  video: ArtifactFile[];
  architecture: ArtifactFile[];
  tools: ArtifactFile[];
}

// ---------------------------------------------------------------------------
// DT (Data Transformation)
// ---------------------------------------------------------------------------
const DT_ARTIFACTS: OfferingArtifacts = {
  video: [
    {
      fileName: 'generated_video.mp4',
      path: '/Artifacts/DT-Artifacts/video/generated_video.mp4',
      fileType: 'mp4',
      title: 'Data Transformation Overview',
      description: 'IBM Data Transformation solution overview with Microsoft',
      fileSize: '5.3 MB',
    },
  ],
  architecture: [
    {
      fileName: 'DT_architecture-kit-data-transformation-microsoft.pdf',
      path: '/Artifacts/DT-Artifacts/architecture/DT_architecture-kit-data-transformation-microsoft.pdf',
      fileType: 'pdf',
      title: 'Data Transformation Architecture Kit',
      description: 'Architecture blueprint for data transformation on Microsoft',
      fileSize: '1.9 MB',
    },
  ],
  tools: [
    {
      fileName: 'DT_client-presentation-data-transformation-with-microsoft-v1.pdf',
      path: '/Artifacts/DT-Artifacts/tools/DT_client-presentation-data-transformation-with-microsoft-v1.pdf',
      fileType: 'pdf',
      title: 'Client Presentation - Data Transformation',
      description: 'Client-facing presentation for data transformation with Microsoft',
      fileSize: '4.6 MB',
    },
    {
      fileName: 'DT_solutioning-guidance with microsoft_WIP.pdf',
      path: '/Artifacts/DT-Artifacts/tools/DT_solutioning-guidance with microsoft_WIP.pdf',
      fileType: 'pdf',
      title: 'Solutioning Guidance with Microsoft',
      description: 'Solution design guidance for data transformation engagements',
      fileSize: '2.1 MB',
    },
  ],
};

// ---------------------------------------------------------------------------
// AMM (Application Migration & Modernization)
// ---------------------------------------------------------------------------
const AMM_ARTIFACTS: OfferingArtifacts = {
  video: [
    {
      fileName: 'generated_video.mp4',
      path: '/Artifacts/AMM-Artifacts/video/generated_video.mp4',
      fileType: 'mp4',
      title: 'Application Modernization Overview',
      description: 'IBM Application Migration & Modernization solution overview',
      fileSize: '5.3 MB',
    },
  ],
  architecture: [
    {
      fileName: 'Apply-Azure-Hybrid-benefit-to-save-cost.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Apply-Azure-Hybrid-benefit-to-save-cost.png',
      fileType: 'png',
      title: 'Azure Hybrid Benefit - Cost Savings',
      description: 'Apply Azure Hybrid Benefit to reduce cloud costs',
    },
    {
      fileName: 'Apply-for-Microsoft-Funding-Programs-to-save-cost.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Apply-for-Microsoft-Funding-Programs-to-save-cost.png',
      fileType: 'png',
      title: 'Microsoft Funding Programs',
      description: 'Apply for Microsoft funding programs to optimize costs',
    },
    {
      fileName: 'Resolve cost reporting problems with improved tagging strategy.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Resolve cost reporting problems with improved tagging strategy.png',
      fileType: 'png',
      title: 'Cost Reporting - Tagging Strategy',
      description: 'Resolve cost reporting issues with improved tagging',
    },
    {
      fileName: 'Resolve High memory-and-CPU-Usage.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Resolve High memory-and-CPU-Usage.png',
      fileType: 'png',
      title: 'Resolve High Memory & CPU Usage',
      description: 'Architecture for resolving high memory and CPU utilization',
    },
    {
      fileName: 'Resolve lack of Governance in SKU Selection.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Resolve lack of Governance in SKU Selection.png',
      fileType: 'png',
      title: 'SKU Selection Governance',
      description: 'Resolve governance gaps in SKU selection',
    },
    {
      fileName: 'Resolve Low memory-&-CPU Usage.png',
      path: '/Artifacts/AMM-Artifacts/architecture/Resolve Low memory-&-CPU Usage.png',
      fileType: 'png',
      title: 'Resolve Low Memory & CPU Usage',
      description: 'Architecture for right-sizing underutilized resources',
    },
  ],
  tools: [
    {
      fileName: 'Technology-Stack.pdf',
      path: '/Artifacts/AMM-Artifacts/tools/Technology-Stack.pdf',
      fileType: 'pdf',
      title: 'AMM Technology Stack',
      description: 'Technology stack overview for application modernization',
    },
  ],
};

// ---------------------------------------------------------------------------
// DPDE (Digital Product Design & Engineering)
// ---------------------------------------------------------------------------
const DPDE_ARTIFACTS: OfferingArtifacts = {
  video: [
    {
      fileName: 'generated_video.mp4',
      path: '/Artifacts/DPDE-Artifacts/video/generated_video.mp4',
      fileType: 'mp4',
      title: 'Digital Product Engineering Overview',
      description: 'IBM Digital Product Design & Engineering solution overview',
      fileSize: '5.3 MB',
    },
  ],
  architecture: [
    {
      fileName: 'Azure SaaS-PaaS-IaaS.png',
      path: '/Artifacts/DPDE-Artifacts/architecture/Azure SaaS-PaaS-IaaS.png',
      fileType: 'png',
      title: 'Azure SaaS / PaaS / IaaS',
      description: 'Azure service model comparison for product engineering',
    },
    {
      fileName: 'DPDE Reference Architecture - Arch Kit.png',
      path: '/Artifacts/DPDE-Artifacts/architecture/DPDE Reference Architecture - Arch Kit.png',
      fileType: 'png',
      title: 'DPDE Reference Architecture',
      description: 'Reference architecture kit for digital product engineering',
    },
    {
      fileName: 'DPDE Security Overview-Arch Kit.png',
      path: '/Artifacts/DPDE-Artifacts/architecture/DPDE Security Overview-Arch Kit.png',
      fileType: 'png',
      title: 'DPDE Security Overview',
      description: 'Security architecture overview for product engineering',
    },
    {
      fileName: 'IBM SDLC Assistant Pack.png',
      path: '/Artifacts/DPDE-Artifacts/architecture/IBM SDLC Assistant Pack.png',
      fileType: 'png',
      title: 'IBM SDLC Assistant Pack',
      description: 'SDLC assistant pack for automated development lifecycle',
    },
  ],
  tools: [
    {
      fileName: 'Requirement driven development with IBM SDLC Automation.png',
      path: '/Artifacts/DPDE-Artifacts/tools/Requirement driven development with IBM SDLC Automation.png',
      fileType: 'png',
      title: 'Requirement-Driven Development',
      description: 'IBM SDLC Automation for requirement-driven development',
    },
    {
      fileName: 'Agentic SDLC and ADLC.pdf',
      path: '/Artifacts/DPDE-Artifacts/tools/Agentic SDLC and ADLC.pdf',
      fileType: 'pdf',
      title: 'Agentic SDLC and ADLC',
      description: 'Agentic Software & Application Development Lifecycle',
    },
    {
      fileName: 'Kiosk Config for Use Cases.xlsx',
      path: '/Artifacts/DPDE-Artifacts/tools/Kiosk Config for Use Cases.xlsx',
      fileType: 'xlsx',
      title: 'Kiosk Configuration - Use Cases',
      description: 'Use case configuration spreadsheet for kiosk deployments',
      fileSize: '57 KB',
    },
  ],
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const ARTIFACT_MANIFEST: Record<string, OfferingArtifacts> = {
  DT: DT_ARTIFACTS,
  AMM: AMM_ARTIFACTS,
  DPDE: DPDE_ARTIFACTS,
};
