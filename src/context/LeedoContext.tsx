import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Child,
  User,
  SystemNotification,
  AuditLog,
  CaseNote,
  HealthRecord,
  CounselingRecord,
  TracingAttempt,
  FamilyInfo,
  ReintegrationRecord,
  GovernmentReferralRecord,
  LeftWithoutNoticeRecord,
  FollowUpRecord,
  ChildDocument,
  TimelineEvent,
  CaseStatus,
  SUSAttendanceRecord,
  VocationalStudent,
} from '../types/leedo';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';
import { ENHANCED_LEEDO_CHILDREN } from '../data/enhancedChildren';
import {
  LEEDO_STAFF_ROSTER,
  INITIAL_SUS_RECORDS,
  INITIAL_VOCATIONAL_STUDENTS,
} from '../data/staffRoster';
import { generateNextChildId, CURRENT_APP_DATE } from '../utils/calculations';

interface QuickActionState {
  open: boolean;
  type?: 'case_note' | 'health' | 'counseling' | 'tracing' | 'family_info' | 'reintegration' | 'referral' | 'followup' | 'left_without_notice' | 'status_update' | 'upload_doc';
  child?: Child;
}

interface LeedoContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  toggleUserActiveStatus: (userId: string) => void;
  children: Child[];
  visibleChildren: Child[]; // Filtered by Role & Location
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
  openChildProfileById: (childId: string) => void;
  deleteChildRecord: (childId: string, reason?: string) => boolean; // Exclusive to Kanta (1002) & Faruque (1057)
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  auditLogs: AuditLog[];
  shelters: string[];
  addShelter: (name: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  quickActionState: QuickActionState;
  setQuickActionState: (state: QuickActionState) => void;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
  
  // School Under the Sky (SUS) Module
  susRecords: SUSAttendanceRecord[];
  addSUSRecord: (record: Omit<SUSAttendanceRecord, 'id' | 'createdAt'>) => void;

  // Kadamtali Vocational Trade Center Module
  vocationalStudents: VocationalStudent[];
  addVocationalStudent: (student: Omit<VocationalStudent, 'id' | 'createdAt'>) => void;
  updateVocationalStudent: (id: string, updates: Partial<VocationalStudent>) => void;

  // Actions
  registerNewChild: (childData: Partial<Child>) => Child;
  updateChild: (childId: string, updates: Partial<Child>, actionDescription?: string) => void;
  addCaseNote: (childId: string, note: Omit<CaseNote, 'id' | 'createdAt' | 'author' | 'authorRole'>) => void;
  addHealthRecord: (childId: string, record: Omit<HealthRecord, 'id' | 'createdAt' | 'createdBy'>) => void;
  addCounselingRecord: (childId: string, record: Omit<CounselingRecord, 'id' | 'createdAt' | 'createdBy'>) => void;
  addTracingAttempt: (childId: string, attempt: Omit<TracingAttempt, 'id' | 'createdAt'>) => void;
  updateFamilyInfo: (childId: string, familyInfo: FamilyInfo) => void;
  reintegrateChild: (childId: string, record: Omit<ReintegrationRecord, 'id' | 'createdAt'>) => void;
  referChild: (childId: string, record: Omit<GovernmentReferralRecord, 'id' | 'createdAt'>) => void;
  transferToPeaceHome: (childId: string, notes?: string) => void;
  markLeftWithoutNotice: (childId: string, record: Omit<LeftWithoutNoticeRecord, 'id' | 'createdAt' | 'recordedBy'>) => void;
  recoverChild: (childId: string, recoveryNotes: string, targetShelter: string) => void;
  updateFollowUp: (childId: string, followUpId: string, updates: Partial<FollowUpRecord>) => void;
  addFollowUp: (childId: string, record: Omit<FollowUpRecord, 'id'>) => void;
  addDocument: (childId: string, doc: Omit<ChildDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  resetToSampleData: () => void;
  
  // Offline & sync
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  pendingSyncCount: number;
  syncOfflineData: () => void;
}

const LeedoContext = createContext<LeedoContextType | undefined>(undefined);

const LOCAL_STORAGE_CHILDREN = 'leedo_children_v3';
const LOCAL_STORAGE_USER = 'leedo_user_v3';
const LOCAL_STORAGE_NOTIFS = 'leedo_notifs_v3';
const LOCAL_STORAGE_AUDIT = 'leedo_audit_v3';
const LOCAL_STORAGE_SHELTERS = 'leedo_shelters_v3';
const LOCAL_STORAGE_USERS = 'leedo_all_users_v3';
const LOCAL_STORAGE_SUS = 'leedo_sus_records_v3';
const LOCAL_STORAGE_VTC = 'leedo_vtc_students_v3';

export const LeedoProvider: React.FC<{ children: React.ReactNode }> = ({ children: componentChildren }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS);
    return saved ? JSON.parse(saved) : LEEDO_STAFF_ROSTER;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default to Kanta (Admin & Finance Director with delete rights)
    return LEEDO_STAFF_ROSTER.find(u => u.id === '1002') || LEEDO_STAFF_ROSTER[0];
  });

  const [children, setChildren] = useState<Child[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CHILDREN);
    return saved ? JSON.parse(saved) : ENHANCED_LEEDO_CHILDREN;
  });

  const [susRecords, setSusRecords] = useState<SUSAttendanceRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SUS);
    return saved ? JSON.parse(saved) : INITIAL_SUS_RECORDS;
  });

  const [vocationalStudents, setVocationalStudents] = useState<VocationalStudent[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_VTC);
    return saved ? JSON.parse(saved) : INITIAL_VOCATIONAL_STUDENTS;
  });

  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [shelters, setShelters] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SHELTERS);
    return saved ? JSON.parse(saved) : ['Kamalapur Shelter', 'Kadamtali Shelter', 'Peace Home'];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false);
  const [quickActionState, setQuickActionState] = useState<QuickActionState>({ open: false });
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CHILDREN, JSON.stringify(children));
  }, [children]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SUS, JSON.stringify(susRecords));
  }, [susRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_VTC, JSON.stringify(vocationalStudents));
  }, [vocationalStudents]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SHELTERS, JSON.stringify(shelters));
  }, [shelters]);

  // Keep selectedChild synchronized when children state changes
  useEffect(() => {
    if (selectedChild) {
      const refreshed = children.find(c => c.id === selectedChild.id);
      if (refreshed) {
        setSelectedChild(refreshed);
      }
    }
  }, [children]);

  // Precise Role-Based & Area-Based Data Isolation
  const visibleChildren = React.useMemo(() => {
    // 1. Super Admin & Head Office: See organization-wide (all areas and all shelters)
    if (
      currentUser.role === 'super_admin' ||
      currentUser.role === 'head_office' ||
      currentUser.role === 'hr_admin' ||
      currentUser.location === 'Head Office'
    ) {
      return children;
    }

    // 2. Peace Home Staff: Strictly Peace Home children and kids transferred to Peace Home
    if (
      currentUser.role === 'peace_home_manager' ||
      currentUser.role === 'peace_home_staff' ||
      currentUser.location === 'Peace Home' ||
      currentUser.assignedShelter === 'Peace Home'
    ) {
      return children.filter(
        c =>
          c.currentShelter === 'Peace Home' ||
          c.caseStatus === 'Long-term Care (Peace Home)' ||
          c.caseStatus === 'Referred to Peace Home'
      );
    }

    // 3. Rescue-Only Outposts (Airport, Mirpur, Tejgaon, RayerBazar)
    // Field staff can only see their rescue outpost's kids (and check which shelter they are currently in)
    const rescueOutposts = ['Airport', 'Mirpur', 'Tejgoan', 'RayerBazar'];
    if (rescueOutposts.includes(currentUser.location as string)) {
      const locNorm = currentUser.location.toLowerCase();
      return children.filter(c => {
        const matchesArea = c.rescueArea && c.rescueArea.toLowerCase().includes(locNorm);
        const matchesStaff =
          (c.assignedStaff && c.assignedStaff.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (c.rescuedByStaff && c.rescuedByStaff.toLowerCase().includes(currentUser.name.toLowerCase()));
        return matchesArea || matchesStaff;
      });
    }

    // 4. Kamalapur Shelter & Rescue Field:
    if (currentUser.location === 'Kamalapur' || currentUser.assignedShelter === 'Kamalapur Shelter') {
      return children.filter(
        c =>
          c.currentShelter === 'Kamalapur Shelter' ||
          (c.rescueArea && c.rescueArea.toLowerCase().includes('kamalapur'))
      );
    }

    // 5. Kadamtali Shelter & Vocational Outpost:
    if (
      currentUser.location === 'Kodomtoli' ||
      currentUser.assignedShelter === 'Kadamtali Shelter' ||
      currentUser.role === 'vocational_instructor'
    ) {
      return children.filter(
        c =>
          c.currentShelter === 'Kadamtali Shelter' ||
          (c.rescueArea && (c.rescueArea.toLowerCase().includes('kadamtali') || c.rescueArea.toLowerCase().includes('sadarghat')))
      );
    }

    // 6. Generic Field Officer fallback
    if (currentUser.role === 'field_officer' || currentUser.role === 'street_educator') {
      return children.filter(c => {
        const matchesStaff = c.assignedStaff?.toLowerCase() === currentUser.name.toLowerCase();
        const matchesArea =
          currentUser.assignedArea &&
          c.rescueArea?.toLowerCase().includes(currentUser.assignedArea.toLowerCase().split('-')[0].trim());
        return matchesStaff || matchesArea;
      });
    }

    return children;
  }, [children, currentUser]);

  const addAuditEntry = (action: string, childId: string, details: string, previousValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      childId,
      details,
      previousValue,
      newValue,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const openChildProfileById = (childId: string) => {
    const found = children.find(c => c.id.toLowerCase() === childId.trim().toLowerCase());
    if (found) {
      setSelectedChild(found);
    }
  };

  // HR Toggle User Active Status (resigned employee removal)
  const toggleUserActiveStatus = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId || u.employeeId === userId) {
          const nextState = !u.isActive;
          addAuditEntry(
            nextState ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
            '',
            `HR ${currentUser.name} set status of ${u.name} (ID: ${u.id}) to ${nextState ? 'Active' : 'Inactive (Resigned)'}`
          );
          return { ...u, isActive: nextState };
        }
        return u;
      })
    );
  };

  // Exclusive Child Deletion / Duplicate Clean (Only Kanta 1002, Faruque 1057, Super Admin)
  const deleteChildRecord = (childId: string, reason?: string): boolean => {
    const canDelete =
      currentUser.canDeleteChildren === true ||
      currentUser.id === '1002' ||
      currentUser.id === '1057' ||
      currentUser.role === 'super_admin';

    if (!canDelete) {
      alert('Unauthorized: Only Admin & Finance Director (Kanta #1002) and HR Manager (Omar Faruque #1057) can delete duplicate child records.');
      return false;
    }

    const childToDelete = children.find(c => c.id === childId);
    if (!childToDelete) return false;

    setChildren(prev => prev.filter(c => c.id !== childId));
    if (selectedChild?.id === childId) {
      setSelectedChild(null);
    }

    addAuditEntry(
      'DELETE_CHILD_RECORD',
      childId,
      `Duplicate or invalid record of ${childToDelete.name} deleted by authorized administrator ${currentUser.name}. Reason: ${reason || 'Duplicate record clean-up'}`
    );

    return true;
  };

  // Add SUS Daily Attendance & Food Distribution Record
  const addSUSRecord = (record: Omit<SUSAttendanceRecord, 'id' | 'createdAt'>) => {
    const newId = `SUS-${new Date().getFullYear()}-${String(susRecords.length + 1).padStart(3, '0')}`;
    const newRec: SUSAttendanceRecord = {
      ...record,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setSusRecords(prev => [newRec, ...prev]);
    addAuditEntry('ADD_SUS_RECORD', '', `Added SUS session at ${record.location} with ${record.totalStudentsAttended} students`);
  };

  // Add Vocational Trainee
  const addVocationalStudent = (student: Omit<VocationalStudent, 'id' | 'createdAt'>) => {
    const newId = `VTC-KAD-${new Date().getFullYear()}-${String(vocationalStudents.length + 1).padStart(3, '0')}`;
    const newStudent: VocationalStudent = {
      ...student,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setVocationalStudents(prev => [newStudent, ...prev]);
    addAuditEntry('ENROLL_VTC_STUDENT', '', `Enrolled student ${student.name} in ${student.enrolledTrade} trade at Kadamtali VTC`);
  };

  const updateVocationalStudent = (id: string, updates: Partial<VocationalStudent>) => {
    setVocationalStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addShelter = (name: string) => {
    if (!shelters.includes(name)) {
      setShelters(prev => [...prev, name]);
      addAuditEntry('ADD_SHELTER', '', `Added new shelter facility: ${name}`);
    }
  };

  const registerNewChild = (childData: Partial<Child>): Child => {
    const newId = generateNextChildId(children);
    const newTimeline: TimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        childId: newId,
        date: childData.rescueDate || CURRENT_APP_DATE,
        title: `Rescued at ${childData.rescueLocation || 'Street Location'}`,
        category: 'Rescue',
        description: childData.reasonForRescue || 'New child rescue recorded.',
        author: currentUser.name,
      },
    ];

    if (childData.policeInvolved && childData.gdNumber) {
      newTimeline.push({
        id: `tl-${Date.now()}-2`,
        childId: newId,
        date: childData.gdDate || childData.rescueDate || CURRENT_APP_DATE,
        title: `GD Recorded: ${childData.gdNumber}`,
        category: 'GD/Police',
        description: `Registered at ${childData.policeStation || 'Police Thana'}`,
        author: currentUser.name,
      });
    }

    if (childData.currentShelter) {
      newTimeline.push({
        id: `tl-${Date.now()}-3`,
        childId: newId,
        date: childData.shelterAdmissionDate || CURRENT_APP_DATE,
        title: `Admitted to ${childData.currentShelter}`,
        category: 'Shelter',
        description: `Intake assigned to ${childData.assignedStaff || currentUser.name}. Room/Bed: ${childData.roomOrBed || 'General Ward'}.`,
        author: currentUser.name,
      });
    }

    const newChild: Child = {
      id: newId,
      name: childData.name || 'Unnamed Child',
      nickname: childData.nickname,
      gender: childData.gender || 'Male',
      estimatedAge: childData.estimatedAge || 10,
      nationality: 'Bangladeshi',
      addressIfKnown: childData.addressIfKnown,
      photoUrl: childData.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80',
      rescuePhotoUrl: childData.rescuePhotoUrl,
      identificationMarks: childData.identificationMarks,
      disabilityOrSpecialNeeds: childData.disabilityOrSpecialNeeds,
      educationInfo: childData.educationInfo,
      otherImportantInfo: childData.otherImportantInfo,
      rescueDate: childData.rescueDate || CURRENT_APP_DATE,
      rescueTime: childData.rescueTime || '12:00',
      rescueLocation: childData.rescueLocation || 'Dhaka Metropolitan',
      rescueArea: childData.rescueArea || (currentUser.location as string) || 'Kamalapur',
      rescueTeam: childData.rescueTeam || 'LEEDO Outreach Unit',
      rescuedByStaff: childData.rescuedByStaff || currentUser.name,
      reasonForRescue: childData.reasonForRescue || 'Vulnerable child found unattended on street',
      conditionAtRescue: childData.conditionAtRescue || 'Exhausted, vulnerable street-connected child',
      immediateProtectionNeeds: childData.immediateProtectionNeeds || 'Safe shelter, food, trauma care',
      policeInvolved: childData.policeInvolved || false,
      gdNumber: childData.gdNumber,
      gdDate: childData.gdDate,
      policeStation: childData.policeStation,
      gdCopyUrl: childData.gdCopyUrl,
      initialAssessment: childData.initialAssessment || {
        assessmentDate: CURRENT_APP_DATE,
        assessedBy: currentUser.name,
        protectionConcerns: 'High risk of street syndicate exploitation',
        immediateSafetyConcerns: 'Lack of legal guardian',
        healthConcerns: 'General pediatric and nutritional assessment needed',
        emergencyNeedsProvided: ['Food', 'Clothing', 'Safe Shelter', 'Psychological First Aid'],
        assessmentNotes: 'Intake initiated upon arrival at facility.',
      },
      currentShelter: childData.currentShelter || 'Kamalapur Shelter',
      shelterAdmissionDate: childData.shelterAdmissionDate || CURRENT_APP_DATE,
      roomOrBed: childData.roomOrBed,
      assignedStaff: childData.assignedStaff || currentUser.name,
      caseStatus: childData.caseStatus || 'New Rescue',
      shelterStatus: childData.currentShelter ? 'Admitted' : undefined,
      familyTracingStatus: 'Not Started',
      healthRecords: [],
      counselingRecords: [],
      tracingAttempts: [],
      followUps: [],
      documents: [],
      caseNotes: [],
      timeline: newTimeline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChildren(prev => [newChild, ...prev]);
    addAuditEntry('REGISTER_CHILD', newId, `Registered child: ${newChild.name} (${newChild.id})`);
    return newChild;
  };

  const updateChild = (childId: string, updates: Partial<Child>, actionDescription?: string) => {
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          const updated = { ...c, ...updates };
          return updated;
        }
        return c;
      })
    );
    addAuditEntry('UPDATE_CHILD', childId, actionDescription || 'Updated child record');
  };

  const addCaseNote = (childId: string, note: Omit<CaseNote, 'id' | 'createdAt' | 'author' | 'authorRole'>) => {
    const newNote: CaseNote = {
      ...note,
      id: `cn-${Date.now()}`,
      author: currentUser.name,
      authorRole: currentUser.role,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            caseNotes: [newNote, ...(c.caseNotes || [])],
          };
        }
        return c;
      })
    );
    addAuditEntry('ADD_CASE_NOTE', childId, `Added note: ${note.title}`);
  };

  const addHealthRecord = (childId: string, record: Omit<HealthRecord, 'id' | 'createdAt' | 'createdBy'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: `hr-${Date.now()}`,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            healthRecords: [newRecord, ...(c.healthRecords || [])],
          };
        }
        return c;
      })
    );
    addAuditEntry('ADD_HEALTH_RECORD', childId, `Medical evaluation recorded by ${record.doctor || 'Doctor'}`);
  };

  const addCounselingRecord = (childId: string, record: Omit<CounselingRecord, 'id' | 'createdAt' | 'createdBy'>) => {
    const newRecord: CounselingRecord = {
      ...record,
      id: `cr-${Date.now()}`,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            counselingRecords: [newRecord, ...(c.counselingRecords || [])],
          };
        }
        return c;
      })
    );
    addAuditEntry('ADD_COUNSELING_RECORD', childId, `Counseling session: ${record.counselingType}`);
  };

  const addTracingAttempt = (childId: string, attempt: Omit<TracingAttempt, 'id' | 'createdAt'>) => {
    const newAttempt: TracingAttempt = {
      ...attempt,
      id: `ta-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          let updatedTracingStatus = c.familyTracingStatus;
          if (attempt.result === 'Successful' || attempt.result === 'Lead Verified') {
            updatedTracingStatus = 'Family Located';
          } else if (attempt.result === 'No Lead') {
            updatedTracingStatus = 'Family Unreachable';
          } else {
            updatedTracingStatus = 'In Progress';
          }

          return {
            ...c,
            familyTracingStatus: updatedTracingStatus,
            tracingAttempts: [newAttempt, ...(c.tracingAttempts || [])],
          };
        }
        return c;
      })
    );
    addAuditEntry('ADD_TRACING_ATTEMPT', childId, `Family tracing log via ${attempt.contactMethod}: ${attempt.result}`);
  };

  const updateFamilyInfo = (childId: string, familyInfo: FamilyInfo) => {
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            familyInfo,
            familyTracingStatus: familyInfo.guardianName ? 'Family Located' : c.familyTracingStatus,
          };
        }
        return c;
      })
    );
    addAuditEntry('UPDATE_FAMILY_INFO', childId, `Updated guardian details: ${familyInfo.guardianName}`);
  };

  // Peace Home Transfer Protocol (Child stays up to 17 yrs after 6 weeks transitional shelter)
  const transferToPeaceHome = (childId: string, notes?: string) => {
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          const event: TimelineEvent = {
            id: `tl-ph-${Date.now()}`,
            childId,
            date: CURRENT_APP_DATE,
            title: 'Transferred to LEEDO Peace Home',
            category: 'Shelter',
            description: notes || 'Exceeded 6 weeks transitional shelter with no family/DSS placement. Formally transferred to Peace Home for long-term care up to 17 years.',
            author: currentUser.name,
          };
          return {
            ...c,
            currentShelter: 'Peace Home',
            caseStatus: 'Long-term Care (Peace Home)',
            shelterStatus: 'Admitted',
            timeline: [event, ...(c.timeline || [])],
          };
        }
        return c;
      })
    );
    addAuditEntry('TRANSFER_PEACE_HOME', childId, `Child transferred to Peace Home for long-term care up to 17 years`);
  };

  const reintegrateChild = (childId: string, record: Omit<ReintegrationRecord, 'id' | 'createdAt'>) => {
    const newRecord: ReintegrationRecord = {
      ...record,
      id: `reint-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          const newFollowUps: FollowUpRecord[] = [
            {
              id: `fu-${Date.now()}-1`,
              childId,
              type: 'Reintegration',
              milestone: '7 days',
              scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
              status: 'Pending',
              officerName: currentUser.name,
            },
            {
              id: `fu-${Date.now()}-2`,
              childId,
              type: 'Reintegration',
              milestone: '30 days',
              scheduledDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
              status: 'Pending',
              officerName: currentUser.name,
            },
            {
              id: `fu-${Date.now()}-3`,
              childId,
              type: 'Reintegration',
              milestone: '3 months',
              scheduledDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
              status: 'Pending',
            },
            {
              id: `fu-${Date.now()}-4`,
              childId,
              type: 'Reintegration',
              milestone: '6 months',
              scheduledDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
              status: 'Pending',
            },
          ];

          return {
            ...c,
            caseStatus: 'Reintegrated',
            shelterStatus: 'Discharged',
            reintegrationRecord: newRecord,
            followUps: [...(c.followUps || []), ...newFollowUps],
            timeline: [
              {
                id: `tl-reint-${Date.now()}`,
                childId,
                date: record.reintegrationDate,
                title: 'Successfully Reintegrated with Family',
                category: 'Reintegration',
                description: `Handed over to ${record.guardianName} (${record.relationshipWithChild}).`,
                author: currentUser.name,
              },
              ...(c.timeline || []),
            ],
          };
        }
        return c;
      })
    );
    addAuditEntry('REINTEGRATE_CHILD', childId, `Reintegrated with guardian ${record.guardianName}`);
  };

  const referChild = (childId: string, record: Omit<GovernmentReferralRecord, 'id' | 'createdAt'>) => {
    const newRecord: GovernmentReferralRecord = {
      ...record,
      id: `ref-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            caseStatus: 'Government Shelter Referral',
            shelterStatus: 'Transferred',
            referralRecord: newRecord,
            timeline: [
              {
                id: `tl-ref-${Date.now()}`,
                childId,
                date: record.referralDate,
                title: `Referred to ${record.shelterOrServiceName || record.referralOrganization}`,
                category: 'Referral',
                description: `Official referral: ${record.referralOrganization}. Reason: ${record.reasonForReferral}`,
                author: currentUser.name,
              },
              ...(c.timeline || []),
            ],
          };
        }
        return c;
      })
    );
    addAuditEntry('REFER_CHILD', childId, `Referred to ${record.shelterOrServiceName || record.referralOrganization}`);
  };

  const markLeftWithoutNotice = (childId: string, record: Omit<LeftWithoutNoticeRecord, 'id' | 'createdAt' | 'recordedBy'>) => {
    const newRecord: LeftWithoutNoticeRecord = {
      ...record,
      id: `lwn-${Date.now()}`,
      recordedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            caseStatus: 'Left Without Notice',
            shelterStatus: 'Left Without Notice',
            leftWithoutNoticeRecord: newRecord,
            timeline: [
              {
                id: `tl-lwn-${Date.now()}`,
                childId,
                date: record.date,
                title: 'Child Left Shelter Without Notice',
                category: 'Status Change',
                description: `Last seen: ${record.lastSeenLocation}. Circumstances: ${record.circumstances}`,
                author: currentUser.name,
              },
              ...(c.timeline || []),
            ],
          };
        }
        return c;
      })
    );
    addAuditEntry('LEFT_WITHOUT_NOTICE', childId, `Marked Left Without Notice. Last seen: ${record.lastSeenLocation}`);
  };

  const recoverChild = (childId: string, recoveryNotes: string, targetShelter: string) => {
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            caseStatus: 'Shelter Stay',
            shelterStatus: 'Admitted',
            currentShelter: targetShelter,
            shelterAdmissionDate: CURRENT_APP_DATE,
            timeline: [
              {
                id: `tl-rec-${Date.now()}`,
                childId,
                date: CURRENT_APP_DATE,
                title: 'Child Successfully Recovered & Re-admitted',
                category: 'Shelter',
                description: `Recovered: ${recoveryNotes}. Readmitted to ${targetShelter}.`,
                author: currentUser.name,
              },
              ...(c.timeline || []),
            ],
          };
        }
        return c;
      })
    );
    addAuditEntry('RECOVER_CHILD', childId, `Recovered and re-admitted to ${targetShelter}`);
  };

  const updateFollowUp = (childId: string, followUpId: string, updates: Partial<FollowUpRecord>) => {
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId && c.followUps) {
          return {
            ...c,
            followUps: c.followUps.map(f => (f.id === followUpId ? { ...f, ...updates } : f)),
          };
        }
        return c;
      })
    );
    addAuditEntry('UPDATE_FOLLOWUP', childId, `Updated follow-up milestone`);
  };

  const addFollowUp = (childId: string, record: Omit<FollowUpRecord, 'id'>) => {
    const newRec: FollowUpRecord = {
      ...record,
      id: `fu-${Date.now()}`,
    };
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            followUps: [...(c.followUps || []), newRec],
          };
        }
        return c;
      })
    );
  };

  const addDocument = (childId: string, doc: Omit<ChildDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newDoc: ChildDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: CURRENT_APP_DATE,
      uploadedBy: currentUser.name,
    };
    setChildren(prev =>
      prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            documents: [...(c.documents || []), newDoc],
          };
        }
        return c;
      })
    );
    addAuditEntry('ADD_DOCUMENT', childId, `Uploaded document: ${doc.title}`);
  };

  const resetToSampleData = () => {
    localStorage.removeItem(LOCAL_STORAGE_CHILDREN);
    localStorage.removeItem(LOCAL_STORAGE_USER);
    localStorage.removeItem(LOCAL_STORAGE_USERS);
    localStorage.removeItem(LOCAL_STORAGE_SUS);
    localStorage.removeItem(LOCAL_STORAGE_VTC);
    setChildren(ENHANCED_LEEDO_CHILDREN);
    setAllUsers(LEEDO_STAFF_ROSTER);
    setSusRecords(INITIAL_SUS_RECORDS);
    setVocationalStudents(INITIAL_VOCATIONAL_STUDENTS);
    setCurrentUser(LEEDO_STAFF_ROSTER[1]); // Default Kanta
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
  };

  const syncOfflineData = () => {
    setPendingSyncCount(0);
  };

  return (
    <LeedoContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        toggleUserActiveStatus,
        children,
        visibleChildren,
        selectedChild,
        setSelectedChild,
        openChildProfileById,
        deleteChildRecord,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLogs,
        shelters,
        addShelter,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        quickActionState,
        setQuickActionState,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        susRecords,
        addSUSRecord,
        vocationalStudents,
        addVocationalStudent,
        updateVocationalStudent,
        registerNewChild,
        updateChild,
        addCaseNote,
        addHealthRecord,
        addCounselingRecord,
        addTracingAttempt,
        updateFamilyInfo,
        transferToPeaceHome,
        reintegrateChild,
        referChild,
        markLeftWithoutNotice,
        recoverChild,
        updateFollowUp,
        addFollowUp,
        addDocument,
        resetToSampleData,
        isOfflineMode,
        toggleOfflineMode,
        pendingSyncCount,
        syncOfflineData,
      }}
    >
      {componentChildren}
    </LeedoContext.Provider>
  );
};

export function useLeedo(): LeedoContextType {
  const context = useContext(LeedoContext);
  if (!context) {
    throw new Error('useLeedo must be used within a LeedoProvider');
  }
  return context;
}
