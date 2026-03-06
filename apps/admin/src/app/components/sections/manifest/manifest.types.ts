export interface ManifestPageProps {
  onNavigateToAI?: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

export interface ManifestData {
  mission: {
    purpose: string;
    problem: string;
    vision: string;
    values: string;
  };
  audience: {
    target: string;
    pains: string;
    goals: string;
    channels: string;
    language: string;
  };
  positioning: {
    uniqueness: string;
    toneOfVoice: string;
    boundaries: string;
    expertise: string;
  };
  contentStrategy: {
    topics: string;
    formats: string;
    frequency: string;
    quality: string;
  };
  editorialPolicy: {
    topicSelection: string;
    research: string;
    factChecking: string;
    ethics: string;
  };
  metrics: {
    kpis: string;
    successDefinition: string;
    targets: string;
  };
  development: {
    direction: string;
    changes: string;
    experiments: string;
  };
  aiInstructions: {
    priorities: string;
    forbidden: string;
    examples: string;
    approval: string;
    sources: string;
  };
}
