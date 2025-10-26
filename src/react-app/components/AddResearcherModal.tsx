import { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { CreateResearcher } from '@/shared/types';

interface AddResearcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (researcher: CreateResearcher) => Promise<void>;
  loading: boolean;
}

export default function AddResearcherModal({ isOpen, onClose, onSubmit, loading }: AddResearcherModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    phone_number: '',
    research_papers_count: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before opening the modal
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when modal closes
      document.body.style.overflow = '';
      
      // Return focus to the element that had it before
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      full_name: '',
      student_id: '',
      phone_number: '',
      research_papers_count: 0,
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (formData.research_papers_count < 0) newErrors.research_papers_count = 'Must be 0 or greater';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        full_name: '',
        student_id: '',
        phone_number: '',
        research_papers_count: 0,
      });
      
      // Close modal after successful submission
      handleClose();
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to add researcher' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Close modal when clicking on the backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-researcher-title"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 id="add-researcher-title" className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Add Researcher
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="modal_full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              ref={firstInputRef}
              type="text"
              id="modal_full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.full_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label htmlFor="modal_student_id" className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              id="modal_student_id"
              value={formData.student_id}
              onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.student_id ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter student ID"
            />
            {errors.student_id && <p className="text-red-600 text-xs mt-1">{errors.student_id}</p>}
          </div>

          <div>
            <label htmlFor="modal_phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="modal_phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.phone_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone_number && <p className="text-red-600 text-xs mt-1">{errors.phone_number}</p>}
          </div>

          <div>
            <label htmlFor="modal_research_papers_count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Research Papers
            </label>
            <input
              type="number"
              id="modal_research_papers_count"
              value={formData.research_papers_count}
              onChange={(e) => setFormData(prev => ({ ...prev, research_papers_count: parseInt(e.target.value) || 0 }))}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.research_papers_count ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.research_papers_count && <p className="text-red-600 text-xs mt-1">{errors.research_papers_count}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-lg disabled:shadow-none"
            >
              {submitting ? 'Adding...' : 'Add Researcher'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
