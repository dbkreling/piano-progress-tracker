import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { DashboardPage } from './features/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold">Practice Log</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/syllabus"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold">Syllabus Tracker</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
