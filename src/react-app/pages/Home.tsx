import { useState } from 'react';
import { BookOpen, Users, Plus } from 'lucide-react';
import { useResearchers } from '@/react-app/hooks/useResearchers';
import AddResearcherModal from '@/react-app/components/AddResearcherModal';
import SearchBar from '@/react-app/components/SearchBar';
import ResearcherList from '@/react-app/components/ResearcherList';
import ResearcherModal from '@/react-app/components/ResearcherModal';
import EditResearcherForm from '@/react-app/components/EditResearcherForm';
import { Researcher, UpdateResearcher } from '@/shared/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResearcher, setEditingResearcher] = useState<Researcher | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  

  const { researchers, loading, createResearcher, updateResearcher, deleteResearcher } = useResearchers(searchQuery);

  const handleViewDetails = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResearcher(null);
  };

  const handleEdit = (researcher: Researcher) => {
    setEditingResearcher(researcher);
    setIsEditFormOpen(true);
    setIsModalOpen(false); // Close details modal if open
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingResearcher(null);
  };

  const handleUpdateResearcher = async (id: number, updates: UpdateResearcher) => {
    try {
      await updateResearcher(id, updates);
      handleCloseEditForm();
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleDelete = async (researcher: Researcher) => {
    if (window.confirm(`Are you sure you want to delete ${researcher.full_name}?`)) {
      try {
        await deleteResearcher(researcher.id);
        handleCloseModal(); // Close modal if it's open
        handleCloseEditForm(); // Close edit form if it's open
      } catch (error) {
        alert('Failed to delete researcher. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="https://mocha-cdn.com/019a2000-9700-777e-86e6-a314058ccd45/scholar-sync-logo.png" 
              alt="ScholarSync Logo" 
              className="w-12 h-12 rounded-lg shadow-soft"
            />
            <h1 className="text-4xl font-bold text-gray-900">ScholarSync</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline Academic Research Management - Connect, Organize, and Discover
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Researchers</p>
                <p className="text-2xl font-semibold text-gray-900">{researchers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Papers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {researchers.reduce((sum, r) => sum + r.research_papers_count, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Papers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {researchers.length > 0 
                    ? Math.round(researchers.reduce((sum, r) => sum + r.research_papers_count, 0) / researchers.length * 10) / 10
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, student ID, or phone number..."
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="ml-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Researcher
            </button>
          </div>

          {/* Researchers List */}
          <ResearcherList
            researchers={researchers}
            loading={loading}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Add Researcher Modal */}
        <AddResearcherModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={createResearcher}
          loading={loading}
        />

        {/* View Details Modal */}
        <ResearcherModal
          researcher={selectedResearcher}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Edit Form Modal */}
        {isEditFormOpen && editingResearcher && (
          <EditResearcherForm
            researcher={editingResearcher}
            onSubmit={handleUpdateResearcher}
            onCancel={handleCloseEditForm}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
