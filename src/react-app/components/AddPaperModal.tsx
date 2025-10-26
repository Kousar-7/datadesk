import { useState, useEffect } from "react";
import { X, Plus, Upload, FileText, AlertCircle } from "lucide-react";
import { ResearchTopic, Researcher } from "@/shared/types";

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperAdded: () => void;
}

export default function AddPaperModal({ isOpen, onClose, onPaperAdded }: AddPaperModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    researcher_id: "",
    topic_id: "",
    publication_year: "",
    journal_name: "",
    abstract: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchTopics();
      fetchResearchers();
    }
  }, [isOpen]);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics");
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  const fetchResearchers = async () => {
    try {
      const response = await fetch("/api/researchers");
      if (response.ok) {
        const data = await response.json();
        setResearchers(data);
      }
    } catch (error) {
      console.error("Failed to fetch researchers:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== "application/pdf") {
        setErrors({ file: "Please upload a PDF file only." });
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        setErrors({ file: "File size must be less than 10MB." });
        return;
      }
      
      setSelectedFile(file);
      setErrors({ ...errors, file: "" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("researcher_id", formData.researcher_id);
      formDataToSend.append("topic_id", formData.topic_id);
      if (formData.publication_year) {
        formDataToSend.append("publication_year", formData.publication_year);
      }
      if (formData.journal_name) {
        formDataToSend.append("journal_name", formData.journal_name);
      }
      if (formData.abstract) {
        formDataToSend.append("abstract", formData.abstract);
      }
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      const response = await fetch("/api/papers", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setFormData({
          title: "",
          researcher_id: "",
          topic_id: "",
          publication_year: "",
          journal_name: "",
          abstract: "",
        });
        setSelectedFile(null);
        setUploadProgress(0);
        onPaperAdded();
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || "Failed to add research paper" });
      }
    } catch (error) {
      setErrors({ general: "Failed to add research paper" });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrors({ ...errors, file: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Research Paper</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Paper Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="researcher_id" className="block text-sm font-medium text-gray-700 mb-2">
                Researcher *
              </label>
              <select
                id="researcher_id"
                name="researcher_id"
                value={formData.researcher_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select a researcher</option>
                {researchers.map((researcher) => (
                  <option key={researcher.id} value={researcher.id}>
                    {researcher.full_name} ({researcher.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="topic_id" className="block text-sm font-medium text-gray-700 mb-2">
                Research Topic *
              </label>
              <select
                id="topic_id"
                name="topic_id"
                value={formData.topic_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                id="publication_year"
                name="publication_year"
                value={formData.publication_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="journal_name" className="block text-sm font-medium text-gray-700 mb-2">
                Journal Name
              </label>
              <input
                type="text"
                id="journal_name"
                name="journal_name"
                value={formData.journal_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
              Abstract
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter the research paper abstract..."
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Paper File (PDF)
            </label>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-3" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-700 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF files only, max 10MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {errors.file && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.file}
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Paper
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
