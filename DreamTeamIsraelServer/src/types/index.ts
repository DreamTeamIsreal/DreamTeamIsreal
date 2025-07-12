export interface User {
  id: string;
  israelId: string; // Encrypted
  fullName: string; // Encrypted
  dateOfBirth: string; // Encrypted
  mobilePhoneNumber: string; // Encrypted
  email: string; // Encrypted
  city: string; // Encrypted
  passwordHash: string;
  mfaSecret?: string;
  mfaEnabled: boolean;
  roles: UserRole[];
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadataTag: string; // For real vs fake identification
}

export interface Candidate {
  id: string;
  userId: string;
  candidacyType: 'Minister' | 'Knesset Committee';
  profileImageUrl?: string;
  fullName: string; // May differ from user's name
  desiredPosition?: string; // For Ministers (1 of 18)
  desiredCommittee?: string; // For Knesset (1 of 15)
  professionalExperience: string; // Encrypted
  education: string; // Encrypted
  personalVision: string; // Encrypted
  
  // Documents (stored as S3 URLs)
  policeRecordUrl?: string;
  wealthDeclarationUrl?: string;
  conflictOfInterestUrl?: string;
  cvUrl?: string;
  
  // Work Plans (encrypted)
  fiveYearPlan?: string;
  longTermVision2048?: string;
  detailedAnnualPlan?: string;
  visionAndWorkPlanInCommittee?: string;
  
  introductionVideoLink?: string;
  additionalDebateQuestion?: string; // Encrypted
  
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  numberOfVotes: number;
  numberOfSupporters: number;
  
  createdAt: Date;
  updatedAt: Date;
  metadataTag: string; // For real vs fake identification
  city?: string; // User's city for district calculations
}

export interface QuizQuestion {
  id: string;
  question: string;
  orderIndex: number;
  createdAt: Date;
  category: string; // Added for frontend grouping
  key: string;      // Added for frontend translation
}

export interface QuizAnswer {
  id: string;
  userHashId: string; // Anonymized user identifier
  questionId: string;
  answer: number; // 1-5 scale
  createdAt: Date;
  metadataTag: string; // For real vs fake identification
}

export interface Supporter {
  id: string;
  userHashId: string; // Anonymized user identifier
  candidateId: string;
  createdAt: Date;
  metadataTag: string; // For real vs fake identification
}

export interface NewsletterSubscriber {
  id: string;
  email: string; // Encrypted
  subscribedAt: Date;
  metadataTag: string; // For real vs fake identification
}

export interface DreamTeamSelection {
  id: string;
  userHashId: string; // Anonymized user identifier
  positionId: string;
  candidateId: string;
  selectionType: 'minister' | 'committee';
  createdAt: Date;
  updatedAt: Date;
  metadataTag: string; // For real vs fake identification
}

export type UserRole = 'voter' | 'candidate' | 'admin';

export interface Position {
  id: string;
  name: string;
  description: string;
  type: 'minister' | 'committee';
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}

export interface EncryptedField {
  encryptedData: string;
  iv: string;
}

export interface RecordIntegrityCheck {
  isReal: boolean;
  mac: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface CandidateSearchParams extends PaginationParams {
  district?: string;
  position?: string;
  search?: string;
  candidacyType?: 'Minister' | 'Knesset Committee';
}

export interface ComparisonMatch {
  candidateId: string;
  quizMatchPercentage: number;
  visionMatchPercentage?: number;
  overallMatchPercentage: number;
}

export interface StatsResponse {
  totalParticipants: number;
  registeredCandidates: number;
  nationalDreamTeam: DreamTeamCandidate[];
  knesssetCommittees: DreamTeamCandidate[];
}

export interface DreamTeamCandidate {
  candidateId: string;
  profileImageUrl?: string;
  fullName: string;
  desiredPosition?: string;
  desiredCommittee?: string;
  district: string;
  numberOfVotes: number;
  numberOfSupporters: number;
  percentageOfVotes: number;
}

export interface MFASetupResponse {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

export interface FileUploadConfig {
  bucket: string;
  key: string;
  contentType: string;
  maxSize: number;
  allowedTypes: string[];
}