import { Link } from 'react-router';
import { BookOpen, Users, FileText, TrendingUp, ArrowRight, Plus, Eye } from 'lucide-react';
import { useResearchers } from '@/react-app/hooks/useResearchers';

export default function Dashboard() {
  const { researchers, loading } = useResearchers();

  const totalPapers = researchers.reduce((sum, r) => sum + r.research_papers_count, 0);
  const avgPapers = researchers.length > 0 ? totalPapers / researchers.length : 0;

  // Get recent researchers (last 5)
  const recentResearchers = researchers
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-6 shadow-soft-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            DataDesk
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Centralized research data management with powerful organization and collaboration tools
          </p>
        </div>

        {/* Main Metrics Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Researchers</p>
                <p className="text-2xl font-bold text-neutral-900">{loading ? '--' : researchers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Papers</p>
                <p className="text-2xl font-bold text-neutral-900">{loading ? '--' : totalPapers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Average Papers</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {loading ? '--' : Math.round(avgPapers * 10) / 10}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-600 to-primary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-bold text-neutral-900">{loading ? '--' : researchers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - More Prominent */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/researchers"
              className="group relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Researchers</h3>
              <p className="text-primary-100 leading-relaxed">Search and explore the complete researcher directory</p>
            </Link>

            <Link
              to="/researchers"
              className="group relative bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-8 text-white shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Researcher</h3>
              <p className="text-secondary-100 leading-relaxed">Register a new researcher profile to the directory</p>
            </Link>

            <Link
              to="/research-papers"
              className="group relative bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl p-8 text-white shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Research Papers</h3>
              <p className="text-primary-100 leading-relaxed">View papers organized by research topics</p>
            </Link>
          </div>
        </div>

        {/* Recent Researchers */}
        <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Recent Researchers</h2>
            <Link 
              to="/researchers"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentResearchers.length > 0 ? (
            <div className="space-y-3">
              {recentResearchers.map((researcher) => (
                <div key={researcher.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {researcher.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{researcher.full_name}</h3>
                    <p className="text-sm text-neutral-600">{researcher.research_papers_count} papers • ID: {researcher.student_id}</p>
                  </div>
                  <Link
                    to="/researchers"
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">No researchers yet</h3>
              <p className="text-neutral-500 mb-4">Get started by adding your first researcher</p>
              <Link 
                to="/researchers"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Researcher
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
