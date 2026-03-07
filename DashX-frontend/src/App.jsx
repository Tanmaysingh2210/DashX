import React from 'react'
import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';
import Platform from './pages/Platform';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/tasks' element={<Tasks />} />
        <Route path='/platform' element={<Platform />} />
      </Routes>
    </div>
  )
}

export default App
