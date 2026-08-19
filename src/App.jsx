import { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import VisitorTracker from '@/components/VisitorTracker';
import AdminGuard from '@/components/AdminGuard';
// Add page imports here
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ForgotAccept from '@/pages/ForgotAccept';
import ForgotReject from '@/pages/ForgotReject';
import ResetAccept from '@/pages/ResetAccept';
import ResetReject from '@/pages/ResetReject';
import Home from '@/pages/Home';
import BankLogin from '@/pages/BankLogin';
import Apply from '@/pages/Apply';
import ApplyAccept from '@/pages/ApplyAccept';
import ApplyReject from '@/pages/ApplyReject';
import TrackRequest from '@/pages/TrackRequest';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminRequests from '@/pages/admin/AdminRequests';
import AdminSubmissions from '@/pages/admin/AdminSubmissions';
import AdminRequestDetail from '@/pages/admin/AdminRequestDetail';
import AdminServices from '@/pages/admin/AdminServices';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminLogin from '@/pages/admin/AdminLogin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password/accept" element={<ForgotAccept />} />
      <Route path="/forgot-password/reject" element={<ForgotReject />} />
      <Route path="/reset-password/accept" element={<ResetAccept />} />
      <Route path="/reset-password/reject" element={<ResetReject />} />
      <Route path="/" element={<Home />} />
      <Route path="/portal" element={<BankLogin />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/apply/accept" element={<ApplyAccept />} />
      <Route path="/apply/reject" element={<ApplyReject />} />
      <Route path="/track/:id" element={<TrackRequest />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/requests/:id" element={<AdminRequestDetail />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <VisitorTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App