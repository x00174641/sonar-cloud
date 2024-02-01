import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import { AuthProvider } from './components/AuthContext';
import Clip from './components/Clips';
function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clip/:videoID" element={<Clip />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
