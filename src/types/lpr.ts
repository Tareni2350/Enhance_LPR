export interface BoundingBox {
  ymin: number; // 0 - 1000
  xmin: number; // 0 - 1000
  ymax: number; // 0 - 1000
  xmax: number; // 0 - 1000
}

export interface QualityAssessment {
  isBlurry: boolean;
  blurScore: number; // 0 - 100 (100 = razor sharp)
  readabilityScore: number; // 0 - 100
  lightingCondition: string;
  degradationFactors: string[];
  enhancementNeeded: boolean;
  recommendations: string[];
}

export interface OcrCharacter {
  char: string;
  confidence: number; // 0 - 100
}

export interface OcrResult {
  rawText: string;
  normalizedNumber: string;
  confidence: number;
  hasIndStrip?: boolean;
  hasHologram?: boolean;
  hasObstructions?: boolean;
  characters?: OcrCharacter[];
}

export interface ValidationResult {
  isValid: boolean;
  formatCategory: string;
  stateCode?: string;
  stateName?: string;
  rtoCode?: string;
  districtRTO?: string;
  series?: string;
  uniqueDigits?: string;
  validationExplanation: string;
  ruleCompliant?: boolean;
  complianceIssues?: string[];
}

export interface LprAnalysisResult {
  plateDetected: boolean;
  boundingBox: BoundingBox;
  vehicleType?: string;
  plateStyle?: string;
  angleDegrees?: number;
  qualityAssessment: QualityAssessment;
  ocrResult: OcrResult;
  validationResult: ValidationResult;
  processingTimeMs?: number;
}

export type PipelineStepStatus = 'pending' | 'active' | 'completed' | 'skipped' | 'error';

export interface PipelineStep {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  status: PipelineStepStatus;
  progressPercent: number;
  metric?: string;
}

export interface ScanHistoryRecord {
  id: string;
  timestamp: number;
  plateNumber: string;
  stateName: string;
  vehicleType: string;
  isValid: boolean;
  blurScore: number;
  isBlurry: boolean;
  formatCategory: string;
  thumbnailUrl: string;
  fullImageUrl?: string;
}

export interface EnhancementSettings {
  sharpness: number; // 0 to 100
  contrast: number; // -50 to 50
  brightness: number; // -50 to 50
  binarize: boolean;
  threshold: number; // 0 to 255
  gamma: number; // 0.5 to 2.0
  activeFilter: 'adaptive-unsharp' | 'high-contrast' | 'binarized' | 'natural';
}
