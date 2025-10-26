import { Trash2, User, Phone, FileText, Hash, Edit, Mail } from 'lucide-react';
import { Researcher } from '@/shared/types';

interface ResearcherListProps {
  researchers: Researcher[];
  loading: boolean;
  onViewDetails: (researcher: Researcher) => void;
  onEdit: (researcher: Researcher) => void;
  onDelete: (researcher: Researcher) => void;
}

export default function ResearcherList({ researchers, loading, onViewDetails, onEdit, onDelete }: ResearcherListProps) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neutral-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-neutral-200 rounded-lg"></div>
                  <div className="h-10 w-10 bg-neutral-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (researchers.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-600 mb-3">No researchers found</h3>
        <p className="text-neutral-500 max-w-md mx-auto">Try adjusting your search criteria or add a new researcher to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-800">Researchers ({researchers.length})</h2>
      </div>
      
      {researchers.map((researcher) => (
        <div key={researcher.id} className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-white font-semibold text-sm">
                      {researcher.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onViewDetails(researcher)}
                    className="text-left group"
                  >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {researcher.full_name}
                    </h3>
                  </button>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Hash className="w-4 h-4" />
                    <span>Student ID: {researcher.student_id}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <a
                    href={`tel:+91${researcher.phone_number}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    •••{researcher.phone_number.slice(-4)}
                  </a>
                </div>
                {researcher.email && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <a
                      href={`mailto:${researcher.email}`}
                      className="hover:text-primary-600 transition-colors truncate"
                    >
                      {researcher.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-neutral-600">
                  <FileText className="w-4 h-4 text-neutral-400" />
                  <span>{researcher.research_papers_count} research papers</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Minimized Design */}
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={() => onEdit(researcher)}
                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                title="Edit researcher"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDelete(researcher)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete researcher"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
