import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  BookOpen,
  FileCheck,
  CheckCircle2,
  Users,
  Shield,
  Smartphone,
  Globe,
  Download,
  Terminal,
  Server,
  KeyRound,
  Home,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quick_start' | 'field_guide' | 'peace_home' | 'hr_admin' | 'deployment'>('quick_start');

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-100 text-red-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              LEEDO CPIS Official User Manual & Deployment Guide
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Complete operating instructions for Field Officers, Shelter Managers, Peace Home Staff, HR Administrators, and Live Hosting Guide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
            Production Ready v3.0
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'quick_start', label: '1. Quick Start & Login' },
          { id: 'field_guide', label: '2. Field Officer & Rescue SOP' },
          { id: 'peace_home', label: '3. 6-Week & Peace Home Protocol' },
          { id: 'hr_admin', label: '4. HR Controls & Duplicate Clean' },
          { id: 'deployment', label: '5. Official Live Deployment' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Section 1: Quick Start */}
      {activeTab === 'quick_start' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-red-600" />
            <span>Master Auth & Staff Login Procedure</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">How to Log In:</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-700 leading-relaxed">
                <li>Click <strong>Switch Staff Account / Log In</strong> in the navigation bar.</li>
                <li>Select your designated 4-digit Staff ID from the official LEEDO roster (e.g. <strong>1002 Murshida Akhter Kanta</strong>, <strong>1057 Omar Faruque</strong>, <strong>1023 Md. Masud</strong>).</li>
                <li>Enter your registered organizational email.</li>
                <li>Enter the Master Auth Passcode provided by HR (Default Master Code: <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold">LEEDO2026</code> or your 4-digit ID).</li>
                <li>Click <strong>Log In</strong>. The system immediately configures your area boundaries.</li>
              </ol>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Area Isolation Security Rules:</h3>
              <ul className="list-disc list-inside space-y-1.5 text-stone-700 leading-relaxed">
                <li><strong>Airport, Mirpur, Tejgaon, RayerBazar:</strong> Field officers only see rescues initiated in their territory. Cannot delete records.</li>
                <li><strong>Kamalapur & Kadamtali:</strong> Full transitional shelter view, bed logs, and local tracing.</li>
                <li><strong>Peace Home:</strong> Restricted to long-term children (&le;17 yrs) referred after 6 weeks.</li>
                <li><strong>Head Office & HR:</strong> Unrestricted nationwide visibility and reporting.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Field Guide */}
      {activeTab === 'field_guide' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span>Mobile Street Outreach & 4R Workflow</span>
          </h2>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h3 className="font-bold text-blue-900 text-sm">Step 1: RESCUE & GD Registration</h3>
              <p>
                When a child is found vulnerable on the streets (railway station, bus terminal, river port, embankment):
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tap <strong>Register New Child / Rescue</strong> on your phone.</li>
                <li>Fill out basic profile (name/nickname, estimated age, photo, distinct scars/marks).</li>
                <li>Record exact rescue time, GPS/landmark, and police station (e.g. Kamalapur GRP, Airport Thana).</li>
                <li>Ensure a <strong>General Diary (GD)</strong> number is logged immediately for legal child custody.</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
              <h3 className="font-bold text-purple-900 text-sm">Step 2: TRANSITIONAL SHELTER & 6-WEEK CLOCK</h3>
              <p>
                Transfer the child to either <strong>Kamalapur Shelter</strong> or <strong>Kadamtali Shelter</strong>.
                The moment admission is saved, the <strong>42-Day 6-Week Alert Timer</strong> activates automatically.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h3 className="font-bold text-emerald-900 text-sm">Step 3: FAMILY TRACING & REINTEGRATION</h3>
              <p>
                Log every telephone inquiry, local council check, and home visit under the <strong>Family Tracing</strong> tab.
                When the family is verified safe, initiate the <strong>Family Reintegration Handover Protocol</strong> with local council witness signatures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 3: Peace Home */}
      {activeTab === 'peace_home' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-600" />
            <span>LEEDO Peace Home Long-Term Care Protocol</span>
          </h2>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-3 leading-relaxed">
            <h3 className="font-bold text-sm">The 6-Week Transitional Shelter Rule:</h3>
            <p>
              By institutional child protection standards, children reside in <strong>Kamalapur</strong> or <strong>Kadamtali</strong> transitional emergency shelters for a maximum duration of <strong>6 weeks (42 days)</strong>.
            </p>
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 space-y-2 font-medium">
              <p><strong>When 6 Weeks Expire:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>If family is traced &rarr; Reintegrate with verified guardians.</li>
                <li>If family cannot take child &rarr; Refer to Department of Social Services (DSS) or certified partner shelter.</li>
                <li><strong>IF NO GOVT OR PARTNER PLACEMENT EXISTS & FAMILY CANNOT BE FOUND &rarr; Formally Refer to LEEDO PEACE HOME.</strong></li>
              </ul>
            </div>
            <p>
              In <strong>Peace Home</strong>, children receive continuous education, psycho-social care, and life skills up to <strong>17 years of age</strong>. Peace Home staff manage dormitory assignments, school tuition, sports, and health monitoring.
            </p>
          </div>
        </div>
      )}

      {/* Content Section 4: HR Admin */}
      {activeTab === 'hr_admin' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span>HR Administration & Duplicate Case Cleanup</span>
          </h2>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
              <h3 className="font-bold text-purple-900 text-sm">Exclusive Deletion Authority:</h3>
              <p>
                To prevent accidental loss of vulnerable children's case files, <strong>Field Officers, Street Educators, and Shelter Caregivers CANNOT delete any child records</strong>.
              </p>
              <p className="font-bold text-purple-800">
                Only the following 3 accounts hold master deletion and duplicate cleanup rights:
              </p>
              <ul className="list-disc list-inside font-semibold space-y-0.5">
                <li>ID 1002 - Murshida Akhter Kanta (Director Admin & Finance)</li>
                <li>ID 1057 - Md. Omar Faruque (Manager HR & Admin)</li>
                <li>ID 1001 - Forhad Hossain (Executive Director)</li>
              </ul>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Managing Resigned / Inactive Employees:</h3>
              <p>
                Under the <strong>Users & Roles</strong> tab, HR can toggle any employee status from <strong>Active</strong> to <strong>Inactive (Resigned)</strong>.
                Once marked inactive, that employee's credentials are immediately blocked from logging into the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 5: Deployment */}
      {activeTab === 'deployment' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Official Live Production Hosting Guide</span>
          </h2>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <div className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono space-y-2">
              <div className="text-emerald-400 font-bold"># Step 1: Deploy with Google Cloud Run / Firebase</div>
              <p>Run the single standard production build command:</p>
              <div className="bg-stone-950 p-2.5 rounded text-white font-bold">
                npm run build
              </div>
              <p className="text-stone-400">
                Generates complete static client-side bundle in <code>dist/</code> backed by cloud Firebase Firestore database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-stone-200 rounded-xl space-y-2">
                <h4 className="font-bold text-stone-900">Custom Domain Setup</h4>
                <p className="text-stone-600">
                  Map your official organizational domain (e.g. <code>cpis.leedo.org</code> or <code>app.leedobd.org</code>) via Google Cloud Run custom domain mappings or Firebase Hosting custom domain.
                </p>
              </div>

              <div className="p-4 border border-stone-200 rounded-xl space-y-2">
                <h4 className="font-bold text-stone-900">Offline PWA Installation</h4>
                <p className="text-stone-600">
                  Staff can open the URL in Chrome on Android / iOS and tap <strong>"Add to Home Screen"</strong> to use it as a native mobile app in the field even with spotty connectivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
