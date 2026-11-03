import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Results from './pages/Results';
import ProteinExplorer from './pages/ProteinExplorer';
import InteractionNetwork from './pages/InteractionNetwork';
import Architecture from './pages/Architecture';
import DatasetExplorer from './pages/DatasetExplorer';
import ModelPerformance from './pages/ModelPerformance';
import Research from './pages/Research';
import Settings from './pages/Settings';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev.slice(-3), newToast]); // max 4 toasts

    // Auto dismiss after 3.8s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout toasts={toasts} addToast={addToast} dismissToast={dismissToast} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/results" element={<Results />} />
          <Route path="/proteins" element={<ProteinExplorer />} />
          <Route path="/network" element={<InteractionNetwork />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/datasets" element={<DatasetExplorer />} />
          <Route path="/performance" element={<ModelPerformance />} />
          <Route path="/research" element={<Research />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
