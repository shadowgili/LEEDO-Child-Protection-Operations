import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  X,
  PlusCircle,
  ShieldCheck,
  Camera,
  Upload,
  User,
  MapPin,
  FileText,
  Home,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { generateNextChildId, CURRENT_APP_DATE } from '../../utils/calculations';
import { Child } from '../../types/leedo';

export const NewChildRegistrationModal: React.FC = () => {
  const {
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    registerNewChild,
    openChildProfileById,
    children,
    currentUser,
    shelters,
  } = useLeedo();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const nextId = generateNextChildId(children);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic
    id: nextId,
    name: '',
    nickname: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    estimatedAge: 10,
    nationality: 'Bangladeshi',
    addressIfKnown: '',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400',
    rescuePhotoUrl: '',
    identificationMarks: '',
    disabilityOrSpecialNeeds: '',
    educationInfo: '',
    otherImportantInfo: '',

    // Step 2: Rescue
    rescueDate: CURRENT_APP_DATE,
    rescueTime: '14:30',
    rescueLocation: '',
    rescueArea: currentUser.assignedArea || 'Dhaka Central - Kamalapur',
    rescueTeam: 'LEEDO Rapid Street Rescue Unit 1',
    rescuedByStaff: currentUser.name,
    reasonForRescue: 'Street-connected vulnerable child at immediate risk of exploitation',
    conditionAtRescue: 'Tired, hungry, lacking adult supervision',
    immediateProtectionNeeds: 'Safe shelter, warm meal, clothing, initial psychosocial support',
    policeInvolved: true,
    gdNumber: '',
    gdDate: CURRENT_APP_DATE,
    policeStation: 'Kamalapur GRP Thana',
    gdCopyUrl: '',

    // Step 3: Initial Assessment
    protectionConcerns: 'Risk of street syndicates, physical harm, and economic exploitation',
    immediateSafetyConcerns: 'No verified legal guardian present in Dhaka city',
    healthConcerns: '',
    abuseExploitationConcerns: 'Potential street violence exposure',
    traffickingConcerns: 'None verified at intake',
    emergencyNeedsProvided: ['Food', 'Clothing', 'Hygiene Kit', 'Psychological First Aid'],
    assessmentDate: CURRENT_APP_DATE,
    assessedBy: currentUser.name,
    assessmentNotes: 'Child is cooperative. Receptive to shelter intake and willing to participate in tracing.',

    // Step 4: Shelter Admission
    currentShelter: currentUser.assignedShelter || 'Kamalapur Shelter',
    shelterAdmissionDate: CURRENT_APP_DATE,
    shelterAdmissionTime: '16:00',
    assignedStaff: currentUser.name,
    roomOrBed: 'Dorm Bed - Admission Intake',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isRegistrationModalOpen) return null;

  const handleCheckboxEmergencyNeed = (need: string) => {
    setFormData(prev => {
      const current = prev.emergencyNeedsProvided;
      if (current.includes(need)) {
        return { ...prev, emergencyNeedsProvided: current.filter(n => n !== need) };
      } else {
        return { ...prev, emergencyNeedsProvided: [...current, need] };
      }
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errors.name = 'Child name is required';
      if (!formData.estimatedAge || formData.estimatedAge < 1 || formData.estimatedAge > 21) {
        errors.estimatedAge = 'Enter a valid estimated age (1 - 21)';
      }
    } else if (currentStep === 2) {
      if (!formData.rescueLocation.trim()) errors.rescueLocation = 'Rescue location is required';
      if (formData.policeInvolved && !formData.gdNumber.trim()) {
        errors.gdNumber = 'Police GD Number is required when police is involved';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev: 1 | 2 | 3 | 4) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
    }
  };

  const handleBack = () => {
    setStep((prev: 1 | 2 | 3 | 4) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    const childPayload: Partial<Child> = {
      name: formData.name,
      nickname: formData.nickname,
      gender: formData.gender,
      dob: formData.dob || undefined,
      estimatedAge: Number(formData.estimatedAge),
      nationality: formData.nationality,
      addressIfKnown: formData.addressIfKnown,
      photoUrl: formData.photoUrl,
      rescuePhotoUrl: formData.rescuePhotoUrl,
      identificationMarks: formData.identificationMarks,
      disabilityOrSpecialNeeds: formData.disabilityOrSpecialNeeds,
      educationInfo: formData.educationInfo,
      otherImportantInfo: formData.otherImportantInfo,

      rescueDate: formData.rescueDate,
      rescueTime: formData.rescueTime,
      rescueLocation: formData.rescueLocation,
      rescueArea: formData.rescueArea,
      rescueTeam: formData.rescueTeam,
      rescuedByStaff: formData.rescuedByStaff,
      reasonForRescue: formData.reasonForRescue,
      conditionAtRescue: formData.conditionAtRescue,
      immediateProtectionNeeds: formData.immediateProtectionNeeds,
      policeInvolved: formData.policeInvolved,
      gdNumber: formData.gdNumber,
      gdDate: formData.gdDate,
      policeStation: formData.policeStation,
      gdCopyUrl: formData.gdCopyUrl,

      initialAssessment: {
        assessmentDate: formData.assessmentDate,
        assessedBy: formData.assessedBy,
        protectionConcerns: formData.protectionConcerns,
        immediateSafetyConcerns: formData.immediateSafetyConcerns,
        healthConcerns: formData.healthConcerns,
        abuseExploitationConcerns: formData.abuseExploitationConcerns,
        traffickingConcerns: formData.traffickingConcerns,
        emergencyNeedsProvided: formData.emergencyNeedsProvided,
        assessmentNotes: formData.assessmentNotes,
      },

      currentShelter: formData.currentShelter,
      shelterAdmissionDate: formData.shelterAdmissionDate,
      shelterAdmissionTime: formData.shelterAdmissionTime,
      assignedStaff: formData.assignedStaff,
      roomOrBed: formData.roomOrBed,
      caseStatus: 'Shelter Stay',
    };

    const newChild = registerNewChild(childPayload);
    setIsRegistrationModalOpen(false);
    openChildProfileById(newChild.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">Register New Child / New Rescue</h2>
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded font-mono font-bold border border-red-500/30">
                  {nextId}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Official LEEDO Child Protection intake and custody handover protocol.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRegistrationModalOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 1 ? 'text-red-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
            <span>Basic Info</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 2 ? 'text-red-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
            <span>Rescue & Police GD</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 3 ? 'text-red-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
            <span>Initial Assessment</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 4 ? 'text-red-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">4</span>
            <span>Shelter Admission</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Allocated Permanent Child ID:</span>
                  <div className="text-sm font-mono font-bold text-red-600">{nextId}</div>
                </div>
                <span className="text-[11px] text-stone-400">Never duplicated • Used across whole case</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Child Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nickname / Street Name
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="e.g. Choto Shakil"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Estimated Age * (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={21}
                    required
                    value={formData.estimatedAge}
                    onChange={e => setFormData({ ...formData, estimatedAge: Number(e.target.value) })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {formErrors.estimatedAge && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.estimatedAge}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Exact DOB (If known)
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  />
                  <span className="text-[10px] text-stone-400">Leave blank if unknown</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Distinct Identification Marks
                  </label>
                  <input
                    type="text"
                    value={formData.identificationMarks}
                    onChange={e => setFormData({ ...formData, identificationMarks: e.target.value })}
                    placeholder="e.g. Mole on left cheek, burn scar on arm"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Disability / Special Needs
                  </label>
                  <input
                    type="text"
                    value={formData.disabilityOrSpecialNeeds}
                    onChange={e => setFormData({ ...formData, disabilityOrSpecialNeeds: e.target.value })}
                    placeholder="e.g. Speech impediment, limp, none"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reported Home Address / Origin (If known)
                </label>
                <input
                  type="text"
                  value={formData.addressIfKnown}
                  onChange={e => setFormData({ ...formData, addressIfKnown: e.target.value })}
                  placeholder="e.g. Village Char Fasson, Bhola or Mymensingh"
                  className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Previous Education
                  </label>
                  <input
                    type="text"
                    value={formData.educationInfo}
                    onChange={e => setFormData({ ...formData, educationInfo: e.target.value })}
                    placeholder="e.g. Class 2 dropout, Madrasa student, Never attended"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Child Profile Photo URL / Preset
                  </label>
                  <input
                    type="text"
                    value={formData.photoUrl}
                    onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RESCUE & POLICE GD */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Rescue Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.rescueDate}
                    onChange={e => setFormData({ ...formData, rescueDate: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Rescue Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.rescueTime}
                    onChange={e => setFormData({ ...formData, rescueTime: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Exact Rescue Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rescueLocation}
                    onChange={e => setFormData({ ...formData, rescueLocation: e.target.value })}
                    placeholder="e.g. Kamalapur Railway Station, Platform 3"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {formErrors.rescueLocation && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.rescueLocation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Operational Area</label>
                  <select
                    value={formData.rescueArea}
                    onChange={e => setFormData({ ...formData, rescueArea: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  >
                    <option value="Dhaka Central - Kamalapur">Dhaka Central - Kamalapur</option>
                    <option value="Old Dhaka - Sadarghat">Old Dhaka - Sadarghat</option>
                    <option value="Dhaka North - Mirpur">Dhaka North - Mirpur</option>
                    <option value="Dhaka Central - Tejgaon">Dhaka Central - Tejgaon</option>
                    <option value="Dhaka West - Gabtoli">Dhaka West - Gabtoli</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Rescue Team</label>
                  <input
                    type="text"
                    value={formData.rescueTeam}
                    onChange={e => setFormData({ ...formData, rescueTeam: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Staff Rescuer / Field Officer
                  </label>
                  <input
                    type="text"
                    value={formData.rescuedByStaff}
                    onChange={e => setFormData({ ...formData, rescuedByStaff: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reason for Rescue & Specific Circumstances
                </label>
                <textarea
                  rows={2}
                  value={formData.reasonForRescue}
                  onChange={e => setFormData({ ...formData, reasonForRescue: e.target.value })}
                  className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Police General Diary (GD) Section */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-stone-800">
                      Police Legal Documentation / General Diary (GD)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={formData.policeInvolved}
                      onChange={e => setFormData({ ...formData, policeInvolved: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Police GD Registered</span>
                  </label>
                </div>

                {formData.policeInvolved && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        GD Number *
                      </label>
                      <input
                        type="text"
                        value={formData.gdNumber}
                        onChange={e => setFormData({ ...formData, gdNumber: e.target.value })}
                        placeholder="e.g. GD-2026-7819"
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      {formErrors.gdNumber && (
                        <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.gdNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        GD Date
                      </label>
                      <input
                        type="date"
                        value={formData.gdDate}
                        onChange={e => setFormData({ ...formData, gdDate: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Police Thana / Station
                      </label>
                      <input
                        type="text"
                        value={formData.policeStation}
                        onChange={e => setFormData({ ...formData, policeStation: e.target.value })}
                        placeholder="e.g. Kotwali Thana"
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: INITIAL ASSESSMENT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Child Safeguarding Immediate Vulnerability Assessment
                </h4>
                <p className="text-[11px] text-amber-800">
                  Assess immediate protection risks, physical safety, potential trafficking threats, and immediate material relief provided.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Immediate Emergency Needs Provided at Rescue
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Food / Warm Meal',
                    'Clothing Replacement',
                    'Hygiene Kit',
                    'Emergency Medical Check',
                    'Psychological First Aid (PFA)',
                    'Temporary Safe Bed',
                  ].map(need => (
                    <label
                      key={need}
                      className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs cursor-pointer hover:bg-stone-100"
                    >
                      <input
                        type="checkbox"
                        checked={formData.emergencyNeedsProvided.includes(need)}
                        onChange={() => handleCheckboxEmergencyNeed(need)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>{need}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Protection Concerns
                  </label>
                  <textarea
                    rows={2}
                    value={formData.protectionConcerns}
                    onChange={e => setFormData({ ...formData, protectionConcerns: e.target.value })}
                    className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Abuse or Exploitation Concerns
                  </label>
                  <textarea
                    rows={2}
                    value={formData.abuseExploitationConcerns}
                    onChange={e => setFormData({ ...formData, abuseExploitationConcerns: e.target.value })}
                    className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Case Worker Assessment Notes & Child Observations
                </label>
                <textarea
                  rows={3}
                  value={formData.assessmentNotes}
                  onChange={e => setFormData({ ...formData, assessmentNotes: e.target.value })}
                  placeholder="Record child's demeanor, emotional state, disclosed background details..."
                  className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: SHELTER ADMISSION */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-900 mb-1">
                  Shelter Facility Assignment
                </h4>
                <p className="text-xs text-stone-500 mb-3">
                  Assign the child to one of the LEEDO shelter facilities. The 6-week shelter alert timer automatically initiates from this admission date.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shelters.map(shelter => (
                    <label
                      key={shelter}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        formData.currentShelter === shelter
                          ? 'border-red-600 bg-red-50/50'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shelter"
                          value={shelter}
                          checked={formData.currentShelter === shelter}
                          onChange={e => setFormData({ ...formData, currentShelter: e.target.value })}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <div className="font-bold text-sm text-stone-900">{shelter}</div>
                          <div className="text-[11px] text-stone-500">
                            {shelter.includes('Kamalapur') ? 'Dhaka Central Facility' : 'Dhaka South Facility'}
                          </div>
                        </div>
                      </div>
                      <Home className="w-5 h-5 text-stone-400" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Admission Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.shelterAdmissionDate}
                    onChange={e => setFormData({ ...formData, shelterAdmissionDate: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Admission Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.shelterAdmissionTime}
                    onChange={e => setFormData({ ...formData, shelterAdmissionTime: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assigned Case Worker / Officer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assignedStaff}
                    onChange={e => setFormData({ ...formData, assignedStaff: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room / Dormitory / Bed Allocation
                  </label>
                  <input
                    type="text"
                    value={formData.roomOrBed}
                    onChange={e => setFormData({ ...formData, roomOrBed: e.target.value })}
                    placeholder="e.g. Dorm A - Bed 05"
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Submitting will automatically create a unique Child ID (<strong>{nextId}</strong>) and instantiate the complete timeline and case folder.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                Continue to Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Rescue Registration</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
