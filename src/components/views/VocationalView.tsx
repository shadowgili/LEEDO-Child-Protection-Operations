import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Scissors,
  Sparkles,
  Laptop,
  Paintbrush,
  Hammer,
  Users,
  PlusCircle,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Search,
  Phone,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { VocationalStudent, VocationalTrade } from '../../types/leedo';

export const VocationalView: React.FC = () => {
  const { vocationalStudents, addVocationalStudent, updateVocationalStudent, currentUser } = useLeedo();
  const [selectedTrade, setSelectedTrade] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const trades: { trade: VocationalTrade; label: string; icon: any; instructor: string; desc: string }[] = [
    {
      trade: 'Sewing',
      label: 'Sewing & Tailoring',
      icon: Scissors,
      instructor: 'Sharmin Akter (1061)',
      desc: 'Pattern cutting, machine stitching, garments craft & embroidery',
    },
    {
      trade: 'Beautification',
      label: 'Beautification & Parlor',
      icon: Sparkles,
      instructor: 'Sharmin Akter Puspo (1062)',
      desc: 'Skin hygiene, facial care, hair grooming and parlor entrepreneurship',
    },
    {
      trade: 'ICT',
      label: 'ICT & Computer Skills',
      icon: Laptop,
      instructor: 'Wahid Hasan Niloy (1068)',
      desc: 'Computer literacy, Bangla/English typing, office documentation, internet safety',
    },
    {
      trade: 'Handicraft',
      label: 'Handicraft & Jute Art',
      icon: Paintbrush,
      instructor: 'Sharmin Akter (1061)',
      desc: 'Eco-friendly jute bag making, bead ornaments, home decor craft',
    },
    {
      trade: 'Carpenter',
      label: 'Carpentry & Woodwork',
      icon: Hammer,
      instructor: 'Saidur Rahman Sajan (1028)',
      desc: 'Wood carving, furniture joinery, safety tool operations',
    },
  ];

  // Filtering
  const filteredStudents = vocationalStudents.filter(s => {
    const matchesTrade = selectedTrade === 'All' || s.enrolledTrade === selectedTrade;
    const matchesSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrolledTrade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTrade && matchesSearch;
  });

  // Modal State
  const [name, setName] = useState('');
  const [age, setAge] = useState(15);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('Kadamtali, Dhaka');
  const [enrolledTrade, setEnrolledTrade] = useState<VocationalTrade>('Sewing');
  const [evaluationProgress, setEvaluationProgress] = useState('Enrolled in foundational module');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeInfo = trades.find(t => t.trade === enrolledTrade);
    const newStudent: Omit<VocationalStudent, 'id' | 'createdAt'> = {
      name,
      age: Number(age),
      gender,
      phone,
      guardianName,
      guardianPhone,
      address,
      enrolledTrade,
      admissionDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
      attendanceRatePercent: 95,
      instructorName: tradeInfo?.instructor || 'VTC Instructor',
      evaluationProgress,
    };
    addVocationalStudent(newStudent);
    setShowAddModal(false);
    // reset form
    setName('');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-stone-900 tracking-tight">
              Kadamtali Vocational Training Center (VTC)
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Rebuild / Livelihood
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Empowering adolescent youth and older street children with certified economic trades: Sewing, Beautification, ICT, Handicraft, and Carpentry.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Enroll New Student in VTC</span>
        </button>
      </div>

      {/* 5 Trade Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {trades.map(t => {
          const Icon = t.icon;
          const count = vocationalStudents.filter(s => s.enrolledTrade === t.trade && s.status === 'Active').length;
          const isSelected = selectedTrade === t.trade;

          return (
            <div
              key={t.trade}
              onClick={() => setSelectedTrade(isSelected ? 'All' : t.trade)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-2 ring-purple-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded-full">
                    {count} enrolled
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm">{t.label}</h3>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{t.desc}</p>
              </div>
              <div className="pt-2 mt-2 border-t border-stone-100 text-[10px] text-stone-600 font-semibold">
                Instructor: {t.instructor}
              </div>
            </div>
          );
        })}
      </div>

      {/* Student List Section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-stone-900 text-sm">
              Enrolled Vocational Trainees ({filteredStudents.length})
            </h3>
            {selectedTrade !== 'All' && (
              <button
                onClick={() => setSelectedTrade('All')}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Clear filter ({selectedTrade})
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search student or trade..."
              className="w-full text-xs pl-9 pr-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-3">Enrolled Trade</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Assigned Instructor</th>
                <th className="py-3 px-3">Evaluation / Progress Report</th>
                <th className="py-3 px-3">Guardian / Address</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900 text-sm">{student.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {student.id} • {student.gender}, {student.age} yrs
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      {student.enrolledTrade}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${student.attendanceRatePercent || 80}%` }}
                        />
                      </div>
                      <span className="font-bold text-stone-800 text-xs">
                        {student.attendanceRatePercent || 80}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-stone-800">{student.instructorName}</div>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-stone-700 text-xs line-clamp-2">
                      {student.evaluationProgress}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-stone-800 font-medium">{student.guardianName || 'N/A'}</div>
                    <div className="text-[10px] text-stone-500 truncate max-w-[150px]">
                      {student.address}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-white">Enroll Student in Kadamtali VTC</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Salma Khatun"
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Age *</label>
                  <input
                    type="number"
                    min={12}
                    max={25}
                    required
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Vocational Trade *</label>
                  <select
                    value={enrolledTrade}
                    onChange={e => setEnrolledTrade(e.target.value as VocationalTrade)}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-white font-bold text-purple-700"
                  >
                    <option value="Sewing">Sewing & Tailoring (Sharmin Akter)</option>
                    <option value="Beautification">Beautification & Parlor (Sharmin Akter Puspo)</option>
                    <option value="ICT">ICT Computer Skills (Wahid Hasan Niloy)</option>
                    <option value="Handicraft">Handicraft & Jute Craft</option>
                    <option value="Carpenter">Carpentry & Woodwork</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    placeholder="e.g. Rokeya Begum"
                    className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Community Address / Slum Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Initial Skill Evaluation Notes</label>
                <textarea
                  rows={2}
                  value={evaluationProgress}
                  onChange={e => setEvaluationProgress(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
