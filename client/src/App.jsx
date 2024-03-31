import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import { AuthProvider } from './components/AuthContext';
import Clip from './components/Clips';
import Discovery from './components/Discovery';
import { ThemeProvider } from "@/components/theme-provider"
import Header from '@/components/Header';
import Admin from './components/Admin';
import UserChannel from './components/UserChannelGet';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clip/:videoID" element={<Clip />}/>
        <Route path="/discovery/" element={<Discovery />}/>
        <Route path="/admin/" element={<Admin />}/>
        <Route path="/user/channel/:username" element={<UserChannel />}/>
      </Routes>
    </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
