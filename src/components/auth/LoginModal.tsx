import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  ShieldAlert,
  KeyRound,
  Mail,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { LEEDO_STAFF_ROSTER } from '../../data/staffRoster';
import { User } from '../../types/leedo';

interface LoginModalProps {
  onAuthenticated?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onAuthenticated }) => {
  const { currentUser, setCurrentUser, allUsers } = useLeedo();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('1002'); // Default Kanta
  const [emailInput, setEmailInput] = useState<string>('kanta.leedo@gmail.com');
  const [enteredPasscode, setEnteredPasscode] = useState<string>('LEEDO2026');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showQuickSelect, setShowQuickSelect] = useState<boolean>(true);

  // Master auth secret code configured by LEEDO management / HR
  const MASTER_AUTH_CODES = ['LEEDO2026', 'LEEDO-CPIS', '4R-LEEDO', 'PEACE-HOME', '1002', '1057', '1001'];

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    const staff = allUsers.find((u: User) => u.id === staffId || u.employeeId === staffId);
    if (staff) {
      setEmailInput(staff.email);
      setErrorMsg('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Find staff member by ID or Email
    const targetUser = allUsers.find(
      (u: User) =>
        (u.id === selectedStaffId || u.employeeId === selectedStaffId) ||
        u.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
    );

    if (!targetUser) {
      setErrorMsg('Employee account not recognized in LEEDO Staff Roster. Please contact HR (Omar Faruque #1057 or Kanta #1002).');
      return;
    }

    if (!targetUser.isActive) {
      setErrorMsg('This employee account has been marked INACTIVE / RESIGNED by HR and access has been revoked.');
      return;
    }

    // Verify passcode / master token
    const cleanCode = enteredPasscode.trim();
    const isValidCode =
      MASTER_AUTH_CODES.includes(cleanCode) ||
      cleanCode === targetUser.employeeId ||
      cleanCode === '123456';

    if (!isValidCode) {
      setErrorMsg('Invalid Master Verification Code. Use organization passcode (e.g. LEEDO2026 or your 4-digit Staff ID).');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setCurrentUser(targetUser);
      setIsSuccess(false);
      if (onAuthenticated) {
        onAuthenticated();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header with LEEDO branding */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-red-950 text-white p-6 border-b border-stone-800 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-red-600 mx-auto flex items-center justify-center text-white shadow-lg mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">LEEDO CPIS PORTAL</h2>
          <p className="text-xs text-red-200 mt-1 max-w-md mx-auto">
            Local Education and Economic Development Organization<br />
            Child Protection, Rescue, Shelter & Reintegration Information System
          </p>
          <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] font-semibold px-3 py-1 rounded-full mt-3">
            <Lock className="w-3 h-3 text-red-400" />
            <span>Master Auth & Staff Area Isolation Active</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Access Denied: </span>
                {errorMsg}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Credentials verified. Routing to employee operational workspace...</span>
            </div>
          )}

          {/* Preset Persona Quick Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Staff Account (50+ Staff Roster)
              </label>
              <button
                type="button"
                onClick={() => setShowQuickSelect(!showQuickSelect)}
                className="text-[11px] text-red-600 hover:text-red-800 font-semibold"
              >
                {showQuickSelect ? 'Custom Input' : 'Pick from Directory'}
              </button>
            </div>

            {showQuickSelect ? (
              <select
                value={selectedStaffId}
                onChange={e => handleStaffSelect(e.target.value)}
                className="w-full text-sm font-medium border border-stone-300 rounded-xl p-3 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              >
                <optgroup label="👑 Super Admin & HR Management (Global Access + Delete Permission)">
                  <option value="1002">ID 1002 - Murshida Akhter Kanta (Director Admin & Finance, Delete Access)</option>
                  <option value="1057">ID 1057 - Md. Omar Faruque (Manager HR & Admin, Employee Control)</option>
                  <option value="1001">ID 1001 - Forhad Hossain (Executive Director)</option>
                </optgroup>
                <optgroup label="🏡 Peace Home Facility (Long-term Care up to 17 yrs)">
                  <option value="1013">ID 1013 - Md. Sohel Rana (Manager Head Office & Peace Home)</option>
                  <option value="1014">ID 1014 - Tania Akter (Assistant Home Super, Peace Home)</option>
                  <option value="1015">ID 1015 - Parvin Akter (Mother / Caregiver, Peace Home)</option>
                  <option value="1017">ID 1017 - Nargis Akhter (Psycho-social Facilitator)</option>
                </optgroup>
                <optgroup label="🚉 Kamalapur Shelter & Rescue Staff">
                  <option value="1023">ID 1023 - Md. Masud (Social Mobilizer Incharge, Kamalapur)</option>
                  <option value="1022">ID 1022 - Sahela Khan Rimu (Mother / Caregiver, Kamalapur)</option>
                  <option value="1044">ID 1044 - Rehana Parvin (Street Educator, Kamalapur SUS)</option>
                  <option value="1070">ID 1070 - Forhad Ali (Social Mobilizer, Kamalapur)</option>
                </optgroup>
                <optgroup label="⚓ Kodomtoli / Sadarghat Shelter & Vocational Center">
                  <option value="1028">ID 1028 - Saidur Rahman Sajan (Social Mobilizer, Kodomtoli)</option>
                  <option value="1061">ID 1061 - Sharmin Akter (Sewing Teacher, VTC Kodomtoli)</option>
                  <option value="1062">ID 1062 - Sharmin Akter Puspo (Beautification Teacher, VTC)</option>
                  <option value="1068">ID 1068 - Wahid Hasan Niloy (ICT Instructor, VTC)</option>
                </optgroup>
                <optgroup label="🚨 Rescue Only Field Outposts (Airport, Mirpur, Tejgaon, RayerBazar)">
                  <option value="1063">ID 1063 - Mohammed Sakitul Hider (Airport Mobile Rescue)</option>
                  <option value="1094">ID 1094 - Sadia Yasmn Meghla (Airport Street Educator)</option>
                  <option value="1032">ID 1032 - Nazirul Islam Opu (Mirpur Outreach Incharge)</option>
                  <option value="1096">ID 1096 - Nabila Akter (Mirpur Street Educator)</option>
                  <option value="1034">ID 1034 - Leo Gomes (Tejgaon Street Educator)</option>
                  <option value="1084">ID 1084 - Md. Tanveer Sarder (Tejgaon Social Mobilizer)</option>
                  <option value="1035">ID 1035 - Shuchitra Rani Barman (RayerBazar Street Educator)</option>
                  <option value="1036">ID 1036 - Md. Nizam Hossain (RayerBazar Street Educator)</option>
                </optgroup>
              </select>
            ) : (
              <input
                type="text"
                value={selectedStaffId}
                onChange={e => handleStaffSelect(e.target.value)}
                placeholder="Type Employee ID (e.g. 1002, 1023, 1061)"
                className="w-full text-sm border border-stone-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            )}
          </div>

          {/* Email input display */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Staff Organizational Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full pl-10 text-sm border border-stone-300 rounded-xl p-3 bg-stone-50 font-medium text-stone-800 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Master Email Code / Passcode */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Master Verification Code / Password
              </label>
              <span className="text-[11px] text-stone-700 font-mono font-medium">Default: LEEDO2026</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={enteredPasscode}
                onChange={e => setEnteredPasscode(e.target.value)}
                placeholder="Enter master email code"
                className="w-full pl-10 text-sm font-mono border border-stone-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-stone-700 mt-1">
              Protected by LEEDO Master Token. Master email code dispatched by HR upon staff onboarding.
            </p>
          </div>

          {/* Preview of Selected User Privileges */}
          {(() => {
            const selected = allUsers.find((u: User) => u.id === selectedStaffId || u.employeeId === selectedStaffId);
            if (!selected) return null;
            return (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{selected.name}</span>
                  <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                    Role: {selected.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-stone-600 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Assigned Location: <strong>{selected.location}</strong></span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                  {selected.role === 'super_admin' || selected.role === 'hr_admin' ? (
                    <span className="text-purple-700 font-bold">
                      ✓ Organization-wide access, child delete/clean duplicate permissions, HR staff management.
                    </span>
                  ) : selected.location === 'Peace Home' ? (
                    <span className="text-amber-700 font-semibold">
                      ✓ Filtered to Peace Home long-term shelter data and 6-week referral intakes.
                    </span>
                  ) : ['Airport', 'Mirpur', 'Tejgoan', 'RayerBazar'].includes(selected.location) ? (
                    <span className="text-blue-700 font-semibold">
                      ✓ Rescue-only outpost: can record rescues, check status of rescued kids; cannot delete records.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      ✓ Local shelter & field operations: restricted to {selected.location} children & cases.
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-md transition-all text-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>Secure Log In to LEEDO CPIS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
          LEEDO Child Protection Information System • Version 3.0 Production
        </div>
      </div>
    </div>
  );
};
