export type AminoType = "hydrophobic" | "polar" | "positive" | "negative" | "special";

export type AminoAcid = {
  code: string;
  name: string;
  type: AminoType;
  note: string;
};

export type Protein = {
  id: string;
  name: string;
  organism?: string;
  length: number;
  sequence: string;
  tags: string[];
};

export type AIAnalysisResult = {
  summary: string;
  secondaryStructurePrediction: string;
  stabilityAssessment: string;
  potentialFunctionalDomains: string;
  clinicalSignificance: string;
  suggestedMutations: string;
};

export type ChatMessage = { role: "user" | "model"; content: string };
