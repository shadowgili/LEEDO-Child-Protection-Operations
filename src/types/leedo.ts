export type UserRole =
  | 'super_admin'
  | 'head_office'
  | 'hr_admin'
  | 'peace_home_manager'
  | 'peace_home_staff'
  | 'shelter_staff'
  | 'field_officer'
  | 'vocational_instructor'
  | 'street_educator';

export type LeedoLocation =
  | 'Head Office'
  | 'Kamalapur'
  | 'Kodomtoli'
  | 'Peace Home'
  | 'Airport'
  | 'Mirpur'
  | 'Tejgoan'
  | 'RayerBazar'
  | 'Sadarghat'
  | 'Shambazar'
  | 'Inclusive School'
  | 'Other';

export interface User {
  id: string; // Staff Code e.g. "1001", "1002", etc.
  employeeId?: string;
  name: string;
  designation?: string;
  department?: string;
  email: string;
  phone?: string;
  location: LeedoLocation | string;
  role: UserRole;
  avatar?: string;
  assignedShelter?: string; // 'Kamalapur Shelter' | 'Kadamtali Shelter' | 'Peace Home'
  assignedArea?: string; // 'Kamalapur', 'Airport', 'Mirpur', 'Tejgoan', 'RayerBazar', 'Sadarghat', 'Shambazar', 'Kodomtoli'
  isActive: boolean; // Managed by HR/Admin
  canDeleteChildren?: boolean; // Only Kanta (1002) and HR Faruque (1057) or Super Admin
  canManageReferralsConfig?: boolean; // Manage custom shelter names
  createdAt?: string;
}

export type CaseStatus =
  | 'New Rescue'
  | 'Initial Assessment'
  | 'Shelter Stay'
  | 'Family Tracing'
  | 'Family Located'
  | 'Family Assessment'
  | 'Ready for Reintegration'
  | 'Reintegrated'
  | 'Government Shelter Referral'
  | 'Referral Follow-up'
  | 'Left Without Notice'
  | 'Case Closed'
  | 'Transferred'
  | 'Referred to Peace Home'
  | 'Long-term Care (Peace Home)';

export type ShelterName =
  | 'Kamalapur Shelter'
  | 'Kadamtali Shelter'
  | 'Peace Home'
  | string;

// School Under the Sky (SUS) Daily Attendance & Meal Record
export interface SUSAttendanceRecord {
  id: string;
  date: string;
  location: 'Airport' | 'Mirpur' | 'Tejgoan' | 'RayerBazar' | 'Kamalapur' | 'Sadarghat' | 'Shambazar' | string;
  totalStudentsAttended: number;
  boysCount: number;
  girlsCount: number;
  conductedBy: string;
  conductedByUserId: string;
  learningTopic?: string;
  foodDistributionNotes?: string;
  foodVoucherOrBillUrl?: string; // Bill copy upload
  foodVoucherFileName?: string;
  photosUrls?: string[];
  remarks?: string;
  createdAt: string;
}

// Vocational Trade Center (Kadamtali) Record
export type VocationalTrade =
  | 'Sewing'
  | 'Beautification'
  | 'ICT'
  | 'Handicraft'
  | 'Carpenter'
  | string;

export interface VocationalStudent {
  id: string; // e.g. "VTC-KAD-2026-001"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string; // Stays outside/community
  enrolledTrade: VocationalTrade;
  admissionDate: string;
  status: 'Active' | 'Completed' | 'Dropped Out' | 'Irregular';
  attendanceRatePercent?: number;
  instructorName?: string;
  evaluationProgress?: string; // 'Good progress on sewing stitch', etc.
  notes?: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  childId: string;
  date: string;
  nextCheckupDate?: string;
  doctor: string;
  heightCm?: number;
  weightKg?: number;
  healthCondition: 'Good' | 'Fair' | 'Critical' | 'Requires Attention';
  illness?: string;
  medication?: string;
  treatment?: string;
  vaccinationInfo?: string;
  medicalReferral?: string;
  notes?: string;
  documentUrl?: string;
  createdAt: string;
  createdBy: string;
}

export interface CounselingRecord {
  id: string;
  childId: string;
  date: string;
  counselor: string;
  counselingType: 'Individual' | 'Trauma Therapy' | 'Group Session' | 'Substance Recovery' | 'Behavioral';
  mainConcern: string;
  intervention: string;
  childResponse: string;
  recommendation: string;
  nextCounselingDate?: string;
  status: 'Completed' | 'Follow-up Needed' | 'Critical Watch';
  isConfidential: boolean;
  confidentialNotes?: string;
  createdAt: string;
  createdBy: string;
}

export interface TracingAttempt {
  id: string;
  childId: string;
  date: string;
  contactPerson: string;
  contactMethod: 'Phone Call' | 'Field Visit' | 'Police Coordination' | 'Social Media' | 'Local Union Parishad' | 'NGO Partner';
  location: string;
  result: 'Successful' | 'Pending' | 'No Lead' | 'Lead Verified';
  notes: string;
  nextAction: string;
  staffResponsible: string;
  createdAt: string;
}

export interface FamilyInfo {
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  relationshipWithChild?: string;
  siblingsInfo?: string;
  occupation?: string;
  incomeMonthly?: string;
  familySize?: number;
  phone?: string;
  altPhone?: string;
  address?: string;
  village?: string;
  union?: string;
  upazila?: string;
  district?: string;
  householdInfo?: string;
  safetyAssessment?: string;
  homeVisitDate?: string;
  homeAssessment?: string;
  assessmentOfficer?: string;
  reintegrationRecommendation?: 'Recommended' | 'Conditional' | 'Not Recommended' | 'Pending Assessment';
  updatedAt?: string;
}

export interface ReintegrationRecord {
  id: string;
  childId: string;
  reintegrationDate: string;
  guardianName: string;
  relationshipWithChild: string;
  handoverPerson: string;
  handoverLocation: string;
  responsibleOfficer: string;
  familyAssessmentSummary: string;
  safetyAssessmentSummary: string;
  reintegrationPlan: string;
  gdNumber?: string;
  policeStation?: string;
  gdDocumentUrl?: string;
  reintegrationPhotoUrl?: string;
  handoverDocumentUrl?: string;
  guardianSignatureConfirmed: boolean;
  officerSignatureConfirmed: boolean;
  witnessInfo?: string;
  additionalNotes?: string;
  createdAt: string;
}

export interface FollowUpRecord {
  id: string;
  childId: string;
  type: 'Reintegration' | 'Referral';
  milestone: '7 days' | '30 days' | '3 months' | '6 months' | '12 months' | 'Weekly' | 'Custom';
  scheduledDate: string;
  completedDate?: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  contactMethod?: 'Home Visit' | 'Phone Call' | 'In-person Shelter Visit' | 'Community Agent';
  childStatus?: 'Safe & Stable' | 'Attending School' | 'Working' | 'Protection Concern' | 'Displaced' | 'Unreachable';
  familyStatus?: string;
  educationStatus?: string;
  healthStatus?: string;
  safetyStatus?: string;
  protectionConcerns?: string;
  officerObservation?: string;
  actionRequired?: string;
  nextFollowUpDate?: string;
  documentUrl?: string;
  officerName?: string;
}

export interface GovernmentReferralRecord {
  id: string;
  childId: string;
  referralDate: string;
  referralOrganization: string;
  shelterOrServiceName: string;
  location: string;
  reasonForReferral: string;
  referralOfficer: string;
  contactPerson: string;
  contactNumber: string;
  referralStatus: 'Active' | 'Under Review' | 'Transferred' | 'Completed';
  admissionConfirmed: boolean;
  referralLetterUrl?: string;
  createdAt: string;
}

export interface LeftWithoutNoticeRecord {
  id: string;
  childId: string;
  date: string;
  time: string;
  lastSeenLocation: string;
  lastSeenBy: string;
  circumstances: string;
  immediateActionsTaken: string;
  familyContacted: boolean;
  familyContactNotes?: string;
  policeInvolved: boolean;
  gdNumber?: string;
  gdDate?: string;
  policeStation?: string;
  gdCopyUrl?: string;
  searchTracingActivities: string;
  currentStatus: 'Missing / Active Search' | 'Recovered' | 'Located with Relative';
  recoveryDate?: string;
  recoveryNotes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface ChildDocument {
  id: string;
  childId: string;
  title: string;
  category:
    | 'Child Photo'
    | 'Rescue Photo'
    | 'GD Copy'
    | 'Medical Document'
    | 'Counseling Document'
    | 'Family Assessment'
    | 'Home Visit Document'
    | 'Reintegration Photo'
    | 'Reintegration Document'
    | 'Referral Letter'
    | 'Referral Confirmation'
    | 'Follow-up Document'
    | 'Other';
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CaseNote {
  id: string;
  childId: string;
  date: string;
  author: string;
  authorRole: UserRole;
  title: string;
  content: string;
  isConfidential: boolean;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  childId: string;
  date: string;
  title: string;
  category: 'Rescue' | 'Shelter' | 'GD/Police' | 'Health' | 'Counseling' | 'Family Tracing' | 'Reintegration' | 'Referral' | 'Incident' | 'Status Change';
  description: string;
  author?: string;
  badgeColor?: string;
}

export type FamilyTracingStatus = 'Not Started' | 'In Progress' | 'Family Located' | 'Family Unreachable' | 'Closed';

export interface Child {
  id: string; // e.g. "LEEDO-2026-0001"
  name: string;
  nickname?: string;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  estimatedAge: number;
  nationality: string;
  addressIfKnown?: string;
  photoUrl?: string;
  rescuePhotoUrl?: string;
  identificationMarks?: string;
  disabilityOrSpecialNeeds?: string;
  educationInfo?: string;
  otherImportantInfo?: string;

  // Rescue Details
  rescueDate: string;
  rescueTime: string;
  rescueLocation: string;
  rescueArea: string;
  rescueTeam: string;
  rescuedByStaff: string;
  reasonForRescue: string;
  conditionAtRescue: string;
  immediateProtectionNeeds: string;
  policeInvolved: boolean;
  gdNumber?: string;
  gdDate?: string;
  policeStation?: string;
  gdCopyUrl?: string;

  // Initial Assessment
  initialAssessment?: {
    assessmentDate: string;
    assessedBy: string;
    protectionConcerns?: string;
    immediateSafetyConcerns?: string;
    healthConcerns?: string;
    abuseExploitationConcerns?: string;
    traffickingConcerns?: string;
    disabilityNotes?: string;
    emergencyNeedsProvided: string[]; // ['Food', 'Clothing', 'Hygiene Kit', 'Medical Check', 'Psychological First Aid']
    assessmentNotes: string;
  };

  // Shelter Details
  currentShelter?: ShelterName;
  shelterAdmissionDate?: string;
  shelterAdmissionTime?: string;
  assignedStaff: string; // Case worker
  assignedArea?: string;
  roomOrBed?: string;
  shelterStatus?: 'Admitted' | 'Discharged' | 'Transferred' | 'Reintegrated' | 'Referred' | 'Left Without Notice';

  // Overall Case Status
  caseStatus: CaseStatus;
  familyTracingStatus: 'Not Started' | 'In Progress' | 'Family Located' | 'Family Unreachable' | 'Closed';

  // Sub-records attached to Child ID
  healthRecords: HealthRecord[];
  counselingRecords: CounselingRecord[];
  tracingAttempts: TracingAttempt[];
  familyInfo?: FamilyInfo;
  reintegrationRecord?: ReintegrationRecord;
  referralRecord?: GovernmentReferralRecord;
  leftWithoutNoticeRecord?: LeftWithoutNoticeRecord;
  followUps: FollowUpRecord[];
  documents: ChildDocument[];
  caseNotes: CaseNote[];
  timeline: TimelineEvent[];

  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface SystemNotification {
  id: string;
  childId?: string;
  childName?: string;
  title: string;
  message: string;
  type: 'health' | 'counseling' | 'tracing' | 'shelter_6weeks' | 'reintegration' | 'referral' | 'security' | 'incident';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  childId?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
}
