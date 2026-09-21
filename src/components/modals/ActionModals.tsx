import React, { useState, useEffect } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  X,
  FileText,
  HeartPulse,
  Brain,
  Search,
  Users,
  Repeat,
  ExternalLink,
  CalendarCheck,
  AlertOctagon,
  Upload,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { CURRENT_APP_DATE } from '../../utils/calculations';
import { CaseStatus } from '../../types/leedo';

export const ActionModals: React.FC = () => {
  const {
    quickActionState,
    setQuickActionState,
    addCaseNote,
    addHealthRecord,
    addCounselingRecord,
    addTracingAttempt,
    updateFamilyInfo,
    reintegrateChild,
    referChild,
    addFollowUp,
    addDocument,
    markLeftWithoutNotice,
    updateChild,
    currentUser,
  } = useLeedo();

  const { open, type, child } = quickActionState;

  // Local state for all action forms
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!child) return;
    if (type === 'case_note') {
      setFormData({
        title: '',
        content: '',
      });
    } else if (type === 'health') {
      setFormData({
        date: CURRENT_APP_DATE,
        healthCondition: 'Good',
        illness: '',
        treatment: '',
        medication: '',
        heightCm: '',
        weightKg: '',
        nextCheckupDate: '',
        doctor: 'Dr. Rafiqul Islam (LEEDO Panel Physician)',
        notes: '',
      });
    } else if (type === 'counseling') {
      setFormData({
        date: CURRENT_APP_DATE,
        counselingType: 'Individual Therapy',
        mainConcern: '',
        intervention: 'Expressive art therapy & cognitive reassurance',
        childResponse: 'Calm, receptive and communicative',
        recommendation: 'Continue weekly counseling sessions',
        status: 'Ongoing',
        nextCounselingDate: '',
        isConfidential: true,
        confidentialNotes: '',
      });
    } else if (type === 'tracing') {
      setFormData({
        date: CURRENT_APP_DATE,
        contactMethod: 'Phone Call',
        contactPerson: '',
        location: '',
        notes: '',
        result: 'Lead Verified',
        nextAction: 'Schedule home visit verification with local union parishad',
      });
    } else if (type === 'family_info') {
      setFormData({
        guardianName: child.familyInfo?.guardianName || '',
        fatherName: child.familyInfo?.fatherName || '',
        motherName: child.familyInfo?.motherName || '',
        relationshipWithChild: child.familyInfo?.relationshipWithChild || 'Father',
        phone: child.familyInfo?.phone || '',
        occupation: child.familyInfo?.occupation || 'Day Laborer',
        incomeMonthly: child.familyInfo?.incomeMonthly || 'BDT 10,000',
        familySize: child.familyInfo?.familySize || 4,
        village: child.familyInfo?.village || '',
        union: child.familyInfo?.union || '',
        upazila: child.familyInfo?.upazila || '',
        district: child.familyInfo?.district || '',
        safetyAssessment: child.familyInfo?.safetyAssessment || 'Household environment physically safe; economic assistance advised.',
        reintegrationRecommendation: child.familyInfo?.reintegrationRecommendation || 'Recommended for Reintegration',
        homeVisitDate: child.familyInfo?.homeVisitDate || CURRENT_APP_DATE,
      });
    } else if (type === 'reintegration') {
      setFormData({
        reintegrationDate: CURRENT_APP_DATE,
        handoverLocation: `${child.currentShelter || 'Kamalapur Shelter'} Office`,
        guardianName: child.familyInfo?.guardianName || '',
        relationshipWithChild: child.familyInfo?.relationshipWithChild || 'Father',
        guardianContact: child.familyInfo?.phone || '',
        guardianAddress: child.familyInfo?.district ? `${child.familyInfo.village || ''}, ${child.familyInfo.upazila || ''}, ${child.familyInfo.district}` : 'Dhaka',
        responsibleOfficer: currentUser.name,
        witnessInfo: 'Ward Councilor / Sub-Inspector GRP',
        familyAssessmentSummary: child.familyInfo?.safetyAssessment || 'Parent demonstrates commitment and stable home environment.',
        reintegrationPlan: 'Child enrolled in local government primary school. Case worker will conduct 7-day initial visit.',
        guardianSignatureConfirmed: true,
        officerSignatureConfirmed: true,
      });
    } else if (type === 'referral') {
      setFormData({
        referralOrganization: 'Government Child Development Center (DSS)',
        shelterOrServiceName: 'Sheikh Russell Shishu Shikhya & Punorbashon Kendra',
        contactPerson: 'Director Welfare Services',
        contactNumber: '+880 2-9887711',
        referralDate: CURRENT_APP_DATE,
        reasonForReferral: 'Long-term institutional care and formal education required; family untraceable despite extensive search.',
        documentsSent: ['Police GD Copy', 'Health Checkup Record', 'LEEDO Social Inquiry Report', 'Child Profile Summary'],
        referralStatus: 'Referred',
      });
    } else if (type === 'followup') {
      setFormData({
        scheduledDate: CURRENT_APP_DATE,
        milestone: '7-Day',
        type: 'Reintegration Check',
        contactMethod: 'In-Person Home Visit',
        status: 'Completed',
        officerObservation: 'Child is doing very well at home. Parent has secured primary school admission form.',
        nextFollowUpDate: '',
      });
    } else if (type === 'upload_doc') {
      setFormData({
        title: '',
        category: 'Police GD Copy',
        fileType: 'PDF',
        fileUrl: 'https://example.com/mock-doc.pdf',
      });
    } else if (type === 'left_without_notice') {
      setFormData({
        incidentDate: CURRENT_APP_DATE,
        incidentTime: '17:30',
        circumstances: 'Child left shelter premises unobserved during evening recreation break.',
        searchActionsTaken: 'Immediate search conducted around Kamalapur railway station, local tea stalls, and previous street hangouts.',
        policeInformed: true,
        gdNumber: '',
        policeStation: 'Kamalapur GRP Thana',
        reportedByStaff: currentUser.name,
      });
    } else if (type === 'status_update') {
      setFormData({
        status: child.caseStatus,
        reason: '',
      });
    }
  }, [type, child]);

  if (!open || !child) return null;

  const handleClose = () => {
    setQuickActionState({ open: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'case_note') {
      if (!formData.title || !formData.content) return;
      addCaseNote(child.id, {
        childId: child.id,
        date: CURRENT_APP_DATE,
        title: formData.title,
        content: formData.content,
        isConfidential: false,
      });
    } else if (type === 'health') {
      addHealthRecord(child.id, {
        childId: child.id,
        date: formData.date,
        healthCondition: formData.healthCondition,
        illness: formData.illness,
        treatment: formData.treatment,
        medication: formData.medication,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        doctor: formData.doctor,
        nextCheckupDate: formData.nextCheckupDate || undefined,
        notes: formData.notes,
      });
    } else if (type === 'counseling') {
      addCounselingRecord(child.id, {
        childId: child.id,
        date: formData.date,
        counselor: currentUser.name,
        counselingType: formData.counselingType,
        mainConcern: formData.mainConcern,
        intervention: formData.intervention,
        childResponse: formData.childResponse,
        recommendation: formData.recommendation,
        status: formData.status,
        nextCounselingDate: formData.nextCounselingDate || undefined,
        isConfidential: formData.isConfidential,
        confidentialNotes: formData.confidentialNotes,
      });
    } else if (type === 'tracing') {
      addTracingAttempt(child.id, {
        childId: child.id,
        date: formData.date,
        contactMethod: formData.contactMethod,
        contactPerson: formData.contactPerson,
        location: formData.location,
        notes: formData.notes,
        result: formData.result,
        nextAction: formData.nextAction,
        staffResponsible: currentUser.name,
      });
    } else if (type === 'family_info') {
      updateFamilyInfo(child.id, formData);
    } else if (type === 'reintegration') {
      reintegrateChild(child.id, formData);
    } else if (type === 'referral') {
      referChild(child.id, {
        childId: child.id,
        referralDate: formData.referralDate,
        referralOrganization: formData.referralOrganization,
        shelterOrServiceName: formData.shelterOrServiceName,
        location: 'Dhaka',
        reasonForReferral: formData.reasonForReferral,
        referralOfficer: currentUser.name,
        contactPerson: formData.contactPerson,
        contactNumber: formData.contactNumber,
        referralStatus: 'Active',
        admissionConfirmed: true,
      });
    } else if (type === 'followup') {
      addFollowUp(child.id, {
        childId: child.id,
        scheduledDate: formData.scheduledDate,
        completedDate: formData.status === 'Completed' ? CURRENT_APP_DATE : undefined,
        milestone: formData.milestone,
        type: formData.type === 'Reintegration Check' ? 'Reintegration' : 'Referral',
        contactMethod: formData.contactMethod,
        status: formData.status,
        officerObservation: formData.officerObservation,
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
      });
    } else if (type === 'upload_doc') {
      addDocument(child.id, {
        childId: child.id,
        title: formData.title,
        category: formData.category,
        fileType: formData.fileType,
        fileUrl: formData.fileUrl,
        fileSize: '1.4 MB',
      });
    } else if (type === 'left_without_notice') {
      markLeftWithoutNotice(child.id, {
        childId: child.id,
        date: formData.incidentDate,
        time: formData.incidentTime,
        lastSeenLocation: child.currentShelter || 'Shelter Facility',
        lastSeenBy: currentUser.name,
        circumstances: formData.circumstances,
        immediateActionsTaken: formData.searchActionsTaken,
        familyContacted: false,
        policeInvolved: formData.policeInformed,
        gdNumber: formData.gdNumber,
        policeStation: formData.policeStation,
        searchTracingActivities: formData.searchActionsTaken,
        currentStatus: 'Missing / Active Search',
      });
    } else if (type === 'status_update') {
      updateChild(
        child.id,
        { caseStatus: formData.status },
        `Status updated to "${formData.status}": ${formData.reason || 'Case management review'}`
      );
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">
              {type === 'case_note' && 'Add Case Note'}
              {type === 'health' && 'Record Health Check-up'}
              {type === 'counseling' && 'Log Psychological Counseling'}
              {type === 'tracing' && 'Log Family Tracing Attempt'}
              {type === 'family_info' && 'Update Family Information & Assessment'}
              {type === 'reintegration' && 'Reintegration Handover Execution'}
              {type === 'referral' && 'Government Shelter Referral'}
              {type === 'followup' && 'Schedule / Complete Follow-up'}
              {type === 'upload_doc' && 'Upload Document / Legal File'}
              {type === 'left_without_notice' && 'Report Child Left Without Notice'}
              {type === 'status_update' && 'Update Child Case Status'}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Child: <strong>{child.name}</strong> ({child.id})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* 1. CASE NOTE */}
          {type === 'case_note' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Daily routine check, behavior observation"
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Case Notes *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content || ''}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Describe observations, interactions, emotional state, or incidents..."
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* 2. HEALTH CHECKUP */}
          {type === 'health' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">General Condition *</label>
                  <select
                    value={formData.healthCondition || 'Good'}
                    onChange={e => setFormData({ ...formData, healthCondition: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor / Illness</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Diagnosis / Illness</label>
                  <input
                    type="text"
                    value={formData.illness || ''}
                    onChange={e => setFormData({ ...formData, illness: e.target.value })}
                    placeholder="e.g. Skin infection, fever, malnutrition"
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Attending Doctor / Clinic</label>
                  <input
                    type="text"
                    value={formData.doctor || ''}
                    onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm || ''}
                    onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg || ''}
                    onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Treatment & Prescribed Medication</label>
                <textarea
                  rows={2}
                  value={formData.treatment || ''}
                  onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Antibiotic course 5 days, vitamin syrup"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={formData.nextCheckupDate || ''}
                  onChange={e => setFormData({ ...formData, nextCheckupDate: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                />
              </div>
            </>
          )}

          {/* 3. COUNSELING */}
          {type === 'counseling' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Session Type *</label>
                  <select
                    value={formData.counselingType || 'Individual Therapy'}
                    onChange={e => setFormData({ ...formData, counselingType: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Initial Intake Counseling">Initial Intake Counseling</option>
                    <option value="Individual Therapy">Individual Therapy</option>
                    <option value="Group Session">Group Session</option>
                    <option value="Trauma Healing">Trauma Healing</option>
                    <option value="Reintegration Preparation">Reintegration Preparation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Main Concern / Trauma Triggers</label>
                <input
                  type="text"
                  value={formData.mainConcern || ''}
                  onChange={e => setFormData({ ...formData, mainConcern: e.target.value })}
                  placeholder="e.g. Street violence memories, anxiety, trust issues"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Therapeutic Intervention</label>
                <input
                  type="text"
                  value={formData.intervention || ''}
                  onChange={e => setFormData({ ...formData, intervention: e.target.value })}
                  placeholder="e.g. Expressive drawing, cognitive reassurance"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Child's Emotional Response</label>
                <textarea
                  rows={2}
                  value={formData.childResponse || ''}
                  onChange={e => setFormData({ ...formData, childResponse: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-900">
                  <input
                    type="checkbox"
                    checked={formData.isConfidential ?? true}
                    onChange={e => setFormData({ ...formData, isConfidential: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Mark Session Notes as Confidential (Safeguarding Protected)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.confidentialNotes || ''}
                  onChange={e => setFormData({ ...formData, confidentialNotes: e.target.value })}
                  placeholder="Confidential psychiatric or trauma notes visible only to authorized counselors..."
                  className="w-full border border-purple-200 rounded-lg p-2 bg-white"
                />
              </div>
            </>
          )}

          {/* 4. FAMILY TRACING */}
          {type === 'tracing' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Attempt Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Method *</label>
                  <select
                    value={formData.contactMethod || 'Phone Call'}
                    onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Physical Visit">Physical Visit</option>
                    <option value="Police Station Check">Police Station Check</option>
                    <option value="Local Government / UP Chairman">Local Government / UP Chairman</option>
                    <option value="Community Intermediary">Community Intermediary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Village UP Member, Maternal Uncle"
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Location / District</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Char Fasson, Bhola"
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Investigation Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.notes || ''}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record what was communicated, phone numbers dialed, or leads uncovered..."
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Outcome / Result *</label>
                  <select
                    value={formData.result || 'Lead Verified'}
                    onChange={e => setFormData({ ...formData, result: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Lead Verified">Lead Verified</option>
                    <option value="Successful">Successful (Family Confirmed)</option>
                    <option value="Unsuccessful">Unsuccessful (Wrong Lead)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Next Action Required</label>
                  <input
                    type="text"
                    value={formData.nextAction || ''}
                    onChange={e => setFormData({ ...formData, nextAction: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* 5. FAMILY INFO */}
          {type === 'family_info' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName || ''}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.relationshipWithChild || ''}
                    onChange={e => setFormData({ ...formData, relationshipWithChild: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Contact</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Occupation & Income</label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-700 block mb-2">Address Breakdown</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Village"
                    value={formData.village || ''}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Union"
                    value={formData.union || ''}
                    onChange={e => setFormData({ ...formData, union: e.target.value })}
                    className="border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Upazila"
                    value={formData.upazila || ''}
                    onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                    className="border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="District"
                    value={formData.district || ''}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Home Safety Assessment</label>
                <textarea
                  rows={2}
                  value={formData.safetyAssessment || ''}
                  onChange={e => setFormData({ ...formData, safetyAssessment: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Reintegration Recommendation
                </label>
                <select
                  value={formData.reintegrationRecommendation || 'Recommended for Reintegration'}
                  onChange={e => setFormData({ ...formData, reintegrationRecommendation: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                >
                  <option value="Recommended for Reintegration">Recommended for Reintegration</option>
                  <option value="Pending Further Assessment">Pending Further Assessment</option>
                  <option value="Not Recommended (High Risk)">Not Recommended (High Risk)</option>
                  <option value="Refer to Government Shelter">Refer to Government Shelter</option>
                </select>
              </div>
            </>
          )}

          {/* 6. REINTEGRATION HANDOVER */}
          {type === 'reintegration' && (
            <>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  Official Reintegration Handover Protocol
                </span>
                <p className="text-[11px] text-emerald-800">
                  Executing this form will update the child's case status to "Reintegrated", schedule the 7-day, 30-day, and 3-month follow-up milestones, and close active shelter occupancy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Handover Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.reintegrationDate || ''}
                    onChange={e => setFormData({ ...formData, reintegrationDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName || ''}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.relationshipWithChild || ''}
                    onChange={e => setFormData({ ...formData, relationshipWithChild: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    value={formData.guardianContact || ''}
                    onChange={e => setFormData({ ...formData, guardianContact: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Handover Location *</label>
                <input
                  type="text"
                  required
                  value={formData.handoverLocation || ''}
                  onChange={e => setFormData({ ...formData, handoverLocation: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Witness / Local Authorities</label>
                <input
                  type="text"
                  value={formData.witnessInfo || ''}
                  onChange={e => setFormData({ ...formData, witnessInfo: e.target.value })}
                  placeholder="e.g. Ward Councilor, Sub-Inspector Police"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reintegration & Schooling Plan</label>
                <textarea
                  rows={2}
                  value={formData.reintegrationPlan || ''}
                  onChange={e => setFormData({ ...formData, reintegrationPlan: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.guardianSignatureConfirmed ?? true}
                    onChange={e => setFormData({ ...formData, guardianSignatureConfirmed: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Physical Handover Deed signed & thumbprinted by legal guardian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.officerSignatureConfirmed ?? true}
                    onChange={e => setFormData({ ...formData, officerSignatureConfirmed: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Verified by LEEDO Executive Case Officer</span>
                </label>
              </div>
            </>
          )}

          {/* 7. GOVERNMENT REFERRAL */}
          {type === 'referral' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Referral Organization *</label>
                <input
                  type="text"
                  required
                  value={formData.referralOrganization || ''}
                  onChange={e => setFormData({ ...formData, referralOrganization: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Facility / Center *</label>
                <input
                  type="text"
                  required
                  value={formData.shelterOrServiceName || ''}
                  onChange={e => setFormData({ ...formData, shelterOrServiceName: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Center Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactNumber || ''}
                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reason for Referral</label>
                <textarea
                  rows={2}
                  value={formData.reasonForReferral || ''}
                  onChange={e => setFormData({ ...formData, reasonForReferral: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* 8. FOLLOW-UP */}
          {type === 'followup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate || ''}
                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Milestone *</label>
                  <select
                    value={formData.milestone || '7-Day'}
                    onChange={e => setFormData({ ...formData, milestone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="7-Day">7-Day</option>
                    <option value="30-Day">30-Day</option>
                    <option value="3-Month">3-Month</option>
                    <option value="6-Month">6-Month</option>
                    <option value="12-Month">12-Month</option>
                    <option value="Special Review">Special Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Method *</label>
                  <select
                    value={formData.contactMethod || 'In-Person Home Visit'}
                    onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="In-Person Home Visit">In-Person Home Visit</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="School Visit">School Visit</option>
                    <option value="Center Visit">Center Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'Completed'}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Officer Observation Notes</label>
                <textarea
                  rows={3}
                  value={formData.officerObservation || ''}
                  onChange={e => setFormData({ ...formData, officerObservation: e.target.value })}
                  placeholder="Record child's welfare, health, school attendance, family stability..."
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* 9. UPLOAD DOCUMENT */}
          {type === 'upload_doc' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Police General Diary Copy - Thana Seal"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category || 'Police GD Copy'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Police GD Copy">Police GD Copy</option>
                    <option value="Court Order">Court Order</option>
                    <option value="Medical Report">Medical Report</option>
                    <option value="Reintegration Agreement">Reintegration Agreement</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Identification Photo">Identification Photo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">File Type</label>
                  <select
                    value={formData.fileType || 'PDF'}
                    onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="JPG">JPG Image</option>
                    <option value="PNG">PNG Image</option>
                    <option value="DOCX">DOCX Word</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Attachment URL / Storage Ref</label>
                <input
                  type="text"
                  value={formData.fileUrl || ''}
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono text-[11px]"
                />
              </div>
            </>
          )}

          {/* 10. LEFT WITHOUT NOTICE */}
          {type === 'left_without_notice' && (
            <>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Child Missing / Left Without Notice Protocol
                </span>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  Immediately alters child status to "Left Without Notice", creates an audit trail entry, and activates emergency street search.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Incident Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.incidentDate || ''}
                    onChange={e => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Approximate Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.incidentTime || ''}
                    onChange={e => setFormData({ ...formData, incidentTime: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Circumstances of Departure *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.circumstances || ''}
                  onChange={e => setFormData({ ...formData, circumstances: e.target.value })}
                  placeholder="How did the child leave? Who saw them last?"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Immediate Search Actions Taken *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.searchActionsTaken || ''}
                  onChange={e => setFormData({ ...formData, searchActionsTaken: e.target.value })}
                  placeholder="Outreach locations checked, stations visited..."
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.policeInformed ?? true}
                    onChange={e => setFormData({ ...formData, policeInformed: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Police Thana Informed / Missing GD Filed</span>
                </label>

                {formData.policeInformed && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Missing GD Number"
                      value={formData.gdNumber || ''}
                      onChange={e => setFormData({ ...formData, gdNumber: e.target.value })}
                      className="border border-stone-300 rounded-lg p-1.5 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Police Station (Thana)"
                      value={formData.policeStation || ''}
                      onChange={e => setFormData({ ...formData, policeStation: e.target.value })}
                      className="border border-stone-300 rounded-lg p-1.5 bg-white"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* 11. STATUS UPDATE */}
          {type === 'status_update' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">New Case Status *</label>
                <select
                  value={formData.status || child.caseStatus}
                  onChange={e => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white font-medium"
                >
                  <option value="New Rescue">New Rescue</option>
                  <option value="Initial Assessment">Initial Assessment</option>
                  <option value="Shelter Stay">Shelter Stay</option>
                  <option value="Family Tracing">Family Tracing</option>
                  <option value="Family Located">Family Located</option>
                  <option value="Family Assessment">Family Assessment</option>
                  <option value="Ready for Reintegration">Ready for Reintegration</option>
                  <option value="Reintegrated">Reintegrated</option>
                  <option value="Government Shelter Referral">Government Shelter Referral</option>
                  <option value="Referral Follow-up">Referral Follow-up</option>
                  <option value="Left Without Notice">Left Without Notice</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Case Closed">Case Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reason / Justification</label>
                <textarea
                  rows={3}
                  value={formData.reason || ''}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="State the clinical or administrative justification for this status change..."
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* Footer Controls */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
            >
              Save & Apply Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
