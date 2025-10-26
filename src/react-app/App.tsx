import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navigation from "@/react-app/components/Navigation";
import Dashboard from "@/react-app/pages/Dashboard";
import Researchers from "@/react-app/pages/Researchers";
import ResearchPapers from "@/react-app/pages/ResearchPapers";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/researchers" element={<Researchers />} />
          <Route path="/research-papers" element={<ResearchPapers />} />
        </Routes>
      </div>
    </Router>
  );
}
