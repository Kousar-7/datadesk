import { useState } from 'react';
import { Users, Plus, BookOpen } from 'lucide-react';
import { useResearchers } from '@/react-app/hooks/useResearchers';
import AddResearcherModal from '@/react-app/components/AddResearcherModal';
import SearchBar from '@/react-app/components/SearchBar';
import ResearcherList from '@/react-app/components/ResearcherList';
import ResearcherModal from '@/react-app/components/ResearcherModal';
import EditResearcherForm from '@/react-app/components/EditResearcherForm';
import { Researcher, UpdateResearcher } from '@/shared/types';

export default function Researchers() {
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
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-soft">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Researchers Directory
              </h1>
              <p className="text-neutral-600">Manage and explore your research community</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Researchers</p>
                <p className="text-2xl font-bold text-neutral-900">{researchers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Papers</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {researchers.reduce((sum, r) => sum + r.research_papers_count, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Average Papers</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {researchers.length > 0 
                    ? Math.round(researchers.reduce((sum, r) => sum + r.research_papers_count, 0) / researchers.length * 10) / 10
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar - Modern Search Design */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 max-w-lg w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, student ID, or phone number..."
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              Add New Researcher
            </button>
          </div>
        </div>

        {/* Researchers List */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-100 overflow-hidden">
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
