import { X, Hash, Phone, FileText, Calendar, Trash2, Edit, Mail } from 'lucide-react';
import { Researcher } from '@/shared/types';

interface ResearcherModalProps {
  researcher: Researcher | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (researcher: Researcher) => void;
  onDelete: (researcher: Researcher) => void;
}

export default function ResearcherModal({ researcher, isOpen, onClose, onEdit, onDelete }: ResearcherModalProps) {
  if (!isOpen || !researcher) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="text-xl font-semibold text-neutral-900">Researcher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">
                {researcher.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{researcher.full_name}</h3>
              <p className="text-gray-600">Researcher Profile</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Student ID</p>
                <p className="text-gray-900">{researcher.student_id}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                <a
                  href={`tel:+91${researcher.phone_number}`}
                  className="text-primary-600 hover:text-primary-800 hover:underline font-medium transition-colors"
                  title="Click to call researcher"
                >
                  +91 {researcher.phone_number.replace(/(\d{5})(\d{5})/, '$1-$2')}
                </a>
              </div>
            </div>
            
            {researcher.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <a
                    href={`mailto:${researcher.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                    title="Click to email researcher"
                  >
                    {researcher.email}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Research Papers</p>
                <p className="text-gray-900">{researcher.research_papers_count} published papers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Added</p>
                <p className="text-gray-900">{formatDate(researcher.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 p-6 bg-neutral-50 border-t border-neutral-200">
          <button
            onClick={() => onEdit(researcher)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(researcher)}
            className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-700 hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
