import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import GroupForm from './components/Groups/GroupForm';
import Profile from './components/Auth/Profile';
import GroupDetails from './components/Groups/GroupDetails';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import MemberDashboard from './components/Dashboard/MemberDashboard';
import GroupList from  './components/Groups/GroupList'
import GroupDiscovery from './components/Groups/GroupDiscovery';
import { NotificationProvider } from './context/NotificationContext';
import NotificationsPage from './pages/Notifications';
import GroupMembers from './components/Groups/GroupMembers';
import ManageMembers from './components/Groups/ManageMembers';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<GroupList />} />
                <Route path="discover" element={<GroupDiscovery />} />
                <Route path="create-group" element={<GroupForm />} />
                <Route path="profile" element={<Profile />} />
                <Route path="/dashboard/notifications" element={<NotificationsPage />} />
                <Route path="group/:groupId" element={<GroupDetails />}>
                  <Route index element={<MemberDashboard />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="members" element={<GroupMembers />} />
                </Route>
              </Route>
            </Route>
            <Route path="/groups/:groupId/manage-members" element={<ManageMembers />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;