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
import { Toaster } from "@/components/ui/toaster"
import CameraFeed from './components/ObsConnect';
import ConfirmCode from './components/CodeConfirmation';
import NotFound from './components/404';
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
    <Header />
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clip/:videoID" element={<Clip />}/>
        <Route path="/discovery" element={<Discovery />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/camera" element={<CameraFeed />}/>
        <Route path="/confirm_user/:username" element={<ConfirmCode />}/>
        <Route path="/user/channel/:username" element={<UserChannel />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;