import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';

// Public
import Home from './pages/public/Home';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentBooks from './pages/student/StudentBooks';
import BookDetails from './pages/student/BookDetails';
import MyBooks from './pages/student/MyBooks';
import Wishlist from './pages/student/Wishlist';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
      </Route>

      {/* Student (protected) */}
      <Route
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/explore" element={<StudentBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/student/dashboard" element={<Navigate to="/dashboard" />} />
      <Route path="/student/books" element={<Navigate to="/explore" />} />
      <Route path="/student/my-books" element={<Navigate to="/my-books" />} />
      <Route path="/student/notifications" element={<Navigate to="/notifications" />} />
      <Route path="/student/profile" element={<Navigate to="/profile" />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
            <div className="text-center">
              <h1 className="text-6xl font-display font-bold text-surface-200 dark:text-surface-700 mb-4">
                404
              </h1>
              <p className="text-surface-400 mb-6">Page not found</p>
              <a href="/" className="btn-primary">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
