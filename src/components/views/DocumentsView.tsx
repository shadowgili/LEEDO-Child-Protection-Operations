import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  FolderLock,
  FileText,
  Search,
  Download,
  Filter,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';
import { Child, ChildDocument } from '../../types/leedo';

export const DocumentsView: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flatten all documents
  const allDocs: Array<{ child: Child; doc: ChildDocument }> = [];
  children.forEach(child => {
    (child.documents || []).forEach(doc => {
      allDocs.push({ child, doc });
    });
  });

  const categories = Array.from(new Set(allDocs.map(d => d.doc.category)));

  const filtered = allDocs.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.doc.title.toLowerCase().includes(q) ||
      item.child.name.toLowerCase().includes(q) ||
      item.child.id.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'all' || item.doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Centralized Legal & Case Document Repository
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Secure archive of Police General Diary (GD) receipts, birth certificates, medical tests, court orders, and child handover deeds.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search document title, child name, or Child ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="text-xs border border-stone-300 rounded-lg p-2 bg-white focus:outline-none sm:w-56"
        >
          <option value="all">All Categories ({allDocs.length})</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ child, doc }) => (
          <div
            key={doc.id}
            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      {doc.category}
                    </span>
                    <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{doc.title}</h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-stone-400 shrink-0">{doc.fileType}</span>
              </div>

              <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-xs">
                <div className="text-stone-500 text-[11px]">Associated Child:</div>
                <div className="flex items-center justify-between mt-0.5">
                  <button
                    onClick={() => openChildProfileById(child.id)}
                    className="font-bold text-stone-900 hover:text-red-600 truncate"
                  >
                    {child.name}
                  </button>
                  <span className="font-mono text-xs font-bold text-red-600">{child.id}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>{formatDate(doc.uploadedAt)}</span>
              <button
                onClick={() => openChildProfileById(child.id)}
                className="text-red-600 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open Dossier</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
