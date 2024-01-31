import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
