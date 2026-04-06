import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Syllabus from './pages/Syllabus';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Manage from './pages/Manage';
import WeakAreas from './pages/WeakAreas';
import Achievements from './pages/Achievements';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="manage" element={<Manage />} />
          <Route path="weak-areas" element={<WeakAreas />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
