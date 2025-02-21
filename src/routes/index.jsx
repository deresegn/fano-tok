import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ForYou from './ForYou';
import Following from './Following';
import Upload from './Upload';
import Profile from './Profile';
import Settings from './Settings';
import Login from '../components/auth/Login';
import PrivateRoute from '../components/auth/PrivateRoute';
import { AuthProvider } from '../contexts/AuthContext';
import Search from './Search';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route index element={<ForYou />} />
          <Route path="following" element={
            <PrivateRoute>
              <Following />
            </PrivateRoute>
          } />
          <Route path="upload" element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          } />
          {/* Profile routes */}
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          {/* Add more routes here later */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;