import { useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import Container from '../components/ui/Container'
import Homepage from '../components/Homepage'
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import Profile from './Profile';
import Header from './Header';

function Index() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <AuthProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
        {isAuthenticated ? <Profile />  : <Homepage />}
    </ThemeProvider>
    </AuthProvider>
  )
}

export default Index
