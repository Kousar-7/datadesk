import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import { Researcher, UpdateResearcher } from '@/shared/types';

interface EditResearcherFormProps {
  researcher: Researcher;
  onSubmit: (id: number, updates: UpdateResearcher) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function EditResearcherForm({ researcher, onSubmit, onCancel, loading }: EditResearcherFormProps) {
  const [formData, setFormData] = useState({
    full_name: researcher.full_name,
    student_id: researcher.student_id,
    phone_number: researcher.phone_number,
    email: researcher.email || '',
    research_papers_count: researcher.research_papers_count,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else {
      // Validate phone number format (10 digits)
      const phoneDigits = formData.phone_number.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        newErrors.phone_number = 'Phone number must be 10 digits';
      }
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.research_papers_count < 0) newErrors.research_papers_count = 'Must be 0 or greater';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      // Format phone number to digits only before submitting
      const phoneDigits = formData.phone_number.replace(/\D/g, '');
      await onSubmit(researcher.id, {
        ...formData,
        phone_number: phoneDigits
      });
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to update researcher' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Edit className="w-4 h-4 text-white" />
            </div>
            Edit Researcher
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            <label htmlFor="edit_full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="edit_full_name"
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
            <label htmlFor="edit_student_id" className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              id="edit_student_id"
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
            <label htmlFor="edit_phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="edit_phone_number"
              value={formData.phone_number}
              onChange={(e) => {
                // Allow only digits, spaces, dashes, parentheses, and plus signs
                const value = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                setFormData(prev => ({ ...prev, phone_number: value }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.phone_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter phone number (e.g., 9876543210)"
            />
            {errors.phone_number && <p className="text-red-600 text-xs mt-1">{errors.phone_number}</p>}
          </div>

          <div>
            <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="edit_email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address (optional)"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="edit_research_papers_count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Research Papers
            </label>
            <input
              type="number"
              id="edit_research_papers_count"
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
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-300 disabled:to-emerald-300 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-lg disabled:shadow-none"
            >
              {submitting ? 'Updating...' : 'Update Researcher'}
            </button>
            <button
              type="button"
              onClick={onCancel}
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
