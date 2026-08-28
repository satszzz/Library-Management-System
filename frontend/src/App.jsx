import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import AuthLayout from './layouts/AuthLayout';

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
import Reservations from './pages/student/Reservations';
import BorrowHistory from './pages/student/BorrowHistory';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import BookForm from './pages/admin/BookForm';
import ManageUsers from './pages/admin/ManageUsers';
import ManageIssues from './pages/admin/ManageIssues';
import ManageReturns from './pages/admin/ManageReturns';
import ManageReservations from './pages/admin/ManageReservations';
import ManageFines from './pages/admin/ManageFines';
import ManageCategories from './pages/admin/ManageCategories';
import Reports from './pages/admin/Reports';
import ActivityLogs from './pages/admin/ActivityLogs';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/student/dashboard" /> : <Register />} />
      </Route>

      {/* Book Details (accessible by all logged in users) */}
      <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/books" element={<StudentBooks />} />
        <Route path="/student/my-books" element={<MyBooks />} />
        <Route path="/student/reservations" element={<Reservations />} />
        <Route path="/student/history" element={<BorrowHistory />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/books/add" element={<BookForm />} />
        <Route path="/admin/books/edit/:id" element={<BookForm />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/issues" element={<ManageIssues />} />
        <Route path="/admin/returns" element={<ManageReturns />} />
        <Route path="/admin/reservations" element={<ManageReservations />} />
        <Route path="/admin/fines" element={<ManageFines />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/activity-logs" element={<ActivityLogs />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
          <div className="text-center">
            <h1 className="text-6xl font-display font-bold text-surface-300 dark:text-surface-600 mb-4">404</h1>
            <p className="text-surface-500 mb-6">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        </div>
      } />
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
