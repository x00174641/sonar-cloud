import { ThemeProvider } from "@/components/theme-provider"
import Homepage from '../components/Homepage'
import { useAuth } from './AuthContext';
import Profile from './Profile';
import Header from './Header';
import { Toaster } from "@/components/ui/toaster"
function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
        {isAuthenticated ? <Profile />  : <Homepage />}
        <Toaster />
    </ThemeProvider>
  )
}

export default Index
