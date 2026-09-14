// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DosenDashboard from './pages/DosenDashboard';
import StudentDashboard from './pages/StudentDashboard';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dosen" element={<DosenDashboard />} />
        <Route path="/mahasiswa" element={<StudentDashboard />} />
        <Route path="/profil" element={<UserProfile />} />
        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
