import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GadgetsPage from './GadgetsPage';
import UsersPage from './UsersPage';
import AssignmentsPage from './AssignmentsPage';
import RequestsPage from './RequestsPage';

/**
 * Admin Dashboard - Main layout and navigation
 */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <NavTab to="/admin" label="Gadgets" />
              <NavTab to="/admin/users" label="Users" />
              <NavTab to="/admin/assignments" label="Assignments" />
              <NavTab to="/admin/requests" label="Requests" />
            </nav>
          </div>
        </div>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<GadgetsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </div>
    </div>
  );
}

/**
 * Reusable Tab Navigation Component
 */
function NavTab({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="px-6 py-4 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 transition-colors"
    >
      {label}
    </Link>
  );
}
