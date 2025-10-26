import { useState, useEffect } from "react";
import { FileText, Users, TrendingUp, Plus, Download, User } from "lucide-react";
import AddPaperModal from "@/react-app/components/AddPaperModal";
import ResearcherModal from "@/react-app/components/ResearcherModal";
import { Researcher } from "@/shared/types";

interface TopicStatistics {
  id: number;
  name: string;
  description: string;
  paper_count: number;
  researcher_count: number;
}

interface ResearchPaper {
  id: number;
  title: string;
  researcher_id: number;
  researcher_name: string;
  topic_id: number;
  topic_name: string;
  publication_year: number | null;
  journal_name: string | null;
  abstract: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
}

export default function ResearchPapers() {
  const [topicStats, setTopicStats] = useState<TopicStatistics[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [isResearcherModalOpen, setIsResearcherModalOpen] = useState(false);

  const fetchTopicStatistics = async () => {
    try {
      const response = await fetch("/api/statistics/topics");
      if (response.ok) {
        const data = await response.json();
        setTopicStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch topic statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPapers = async (topicId?: number) => {
    try {
      const url = topicId ? `/api/papers?topic_id=${topicId}` : "/api/papers";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPapers(data);
      }
    } catch (error) {
      console.error("Failed to fetch papers:", error);
    }
  };

  const handleViewResearcherDetails = async (researcherId: number) => {
    try {
      const response = await fetch(`/api/researchers/${researcherId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch researcher details");
      }
      const researcherData: Researcher = await response.json();
      setSelectedResearcher(researcherData);
      setIsResearcherModalOpen(true);
    } catch (error) {
      console.error("Error fetching researcher details:", error);
      alert("Failed to load researcher details.");
    }
  };

  const handleCloseResearcherModal = () => {
    setIsResearcherModalOpen(false);
    setSelectedResearcher(null);
  };

  const handleTopicClick = (topicId: number) => {
    setSelectedTopic(topicId);
    fetchPapers(topicId);
  };

  const handleBackToOverview = () => {
    setSelectedTopic(null);
    setPapers([]);
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      alert("Failed to download file");
    }
  };

  useEffect(() => {
    fetchTopicStatistics();
  }, []);

  const handlePaperAdded = () => {
    fetchTopicStatistics();
    if (selectedTopic) {
      fetchPapers(selectedTopic);
    }
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  const totalPapers = topicStats.reduce((sum, topic) => sum + topic.paper_count, 0);
  const totalTopics = topicStats.filter(topic => topic.paper_count > 0).length;
  const selectedTopicData = selectedTopic ? topicStats.find(t => t.id === selectedTopic) : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-soft">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {selectedTopicData ? selectedTopicData.name : "Research Papers"}
              </h1>
              <p className="text-neutral-600">
                {selectedTopicData 
                  ? `Browse papers in ${selectedTopicData.name}` 
                  : "Analyze research output by topic and track publication trends"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {selectedTopic && (
              <button
                onClick={handleBackToOverview}
                className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-all duration-200"
              >
                ← Back to Topics
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg font-medium transform hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5" />
              Add Paper
            </button>
          </div>
        </div>

        {!selectedTopic ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Papers</p>
                    <p className="text-2xl font-bold text-neutral-900">{totalPapers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Active Topics</p>
                    <p className="text-2xl font-bold text-neutral-900">{totalTopics}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Avg Papers/Topic</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {totalTopics > 0 ? (totalPapers / totalTopics).toFixed(1) : "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicStats.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-100 overflow-hidden group cursor-pointer"
                  onClick={() => topic.paper_count > 0 && handleTopicClick(topic.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
                        {topic.name}
                      </h3>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-primary-600">
                          {topic.paper_count}
                        </span>
                        <span className="text-xs text-neutral-500">papers</span>
                      </div>
                    </div>
                    
                    {topic.description && (
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{topic.researcher_count} researchers</span>
                      </div>
                      
                      {topic.paper_count > 0 && (
                        <div className="w-full bg-neutral-200 rounded-full h-2 ml-4">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((topic.paper_count / Math.max(...topicStats.map(t => t.paper_count))) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {topic.paper_count > 0 && (
                    <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100">
                      <span className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                        View {topic.paper_count} paper{topic.paper_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {topicStats.length === 0 && (
              <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">No research papers yet</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">Start adding research papers to see topic-based analytics and track publication trends</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-soft font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add First Paper
                </button>
              </div>
            )}
          </>
        ) : (
          /* Papers List View */
          <div className="space-y-6">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                      {paper.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-neutral-600">
                      <button
                        onClick={() => handleViewResearcherDetails(paper.researcher_id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                      >
                        <User className="h-4 w-4" />
                        {paper.researcher_name}
                      </button>
                      
                      <span className="px-3 py-1.5 bg-secondary-50 text-secondary-700 rounded-lg font-medium">
                        {paper.topic_name}
                      </span>
                      
                      {paper.publication_year && (
                        <span className="text-neutral-500">
                          Published: {paper.publication_year}
                        </span>
                      )}
                      
                      {paper.journal_name && (
                        <span className="text-neutral-500">
                          Journal: {paper.journal_name}
                        </span>
                      )}
                    </div>
                    
                    {paper.abstract && (
                      <p className="text-neutral-600 line-clamp-3 mb-4">
                        {paper.abstract}
                      </p>
                    )}
                  </div>
                  
                  {paper.file_url && (
                    <div className="flex flex-col items-center justify-center gap-3 lg:min-w-[200px]">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <FileText className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-neutral-900 text-sm mb-1">
                          {paper.file_name}
                        </p>
                        {paper.file_size && (
                          <p className="text-xs text-neutral-500 mb-3">
                            {(paper.file_size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                        <button
                          onClick={() => handleDownloadFile(paper.file_url!, paper.file_name!)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {papers.length === 0 && (
              <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-12 text-center">
                <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  No papers in this topic yet
                </h3>
                <p className="text-neutral-600 mb-6">
                  Start adding papers to {selectedTopicData?.name}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-soft font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Paper
                </button>
              </div>
            )}
          </div>
        )}

        <AddPaperModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onPaperAdded={handlePaperAdded}
        />

        <ResearcherModal
          researcher={selectedResearcher}
          isOpen={isResearcherModalOpen}
          onClose={handleCloseResearcherModal}
          onEdit={() => {
            handleCloseResearcherModal();
            // Could navigate to researchers page or show edit form
          }}
          onDelete={() => {
            handleCloseResearcherModal();
            // Could show delete confirmation
          }}
        />
      </div>
    </div>
  );
}
