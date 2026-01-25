import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import ChatSession from './pages/ChatSession';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatSession />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;