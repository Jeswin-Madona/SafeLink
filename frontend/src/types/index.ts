export type Role = 'ROLE_USER' | 'ROLE_GUARDIAN' | 'ROLE_OFFICIAL' | 'ROLE_ADMIN';

export type EmergencyStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESPONDING' | 'RESOLVED' | 'CANCELLED';

export type IncidentStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type JourneyStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type NotificationType = 'SOS' | 'INCIDENT_UPDATE' | 'JOURNEY_ALERT' | 'COMMUNITY_REVIEW' | 'SYSTEM';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: Role;
  badgeNumber?: string;
  department?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Emergency {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  latitude: number;
  longitude: number;
  address: string;
  status: EmergencyStatus;
  triggerReason: string;
  responseNotes?: string;
  assignedOfficialName?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  reporterId?: number;
  reporterDisplayName: string;
  title: string;
  description: string;
  category: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  approximateAddress: string;
  anonymous: boolean;
  aiAnalyzed: boolean;
  aiSummary?: string;
  aiSuggestedCategory?: string;
  aiSuggestedSeverity?: string;
  aiRiskFactors?: string;
  officialNotes?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityPost {
  id: number;
  authorId?: number;
  authorDisplayName: string;
  isAuthorSelf: boolean;
  title: string;
  content: string;
  category: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  anonymous: boolean;
  status: IncidentStatus;
  confirmationsCount: number;
  officialReviewNote?: string;
  createdAt: string;
}

export interface Journey {
  id: number;
  userId: number;
  userName: string;
  originName: string;
  destinationName: string;
  startLatitude: number;
  startLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
  expectedDurationMinutes: number;
  status: JourneyStatus;
  estimatedRiskScore?: number;
  routeLabel?: string;
  companionModeEnabled: boolean;
  shareWithGuardians: boolean;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actorId?: number;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: string;
  clientIp?: string;
  recordHash?: string;
  timestamp: string;
}
