import { ThemeProvider } from "@/components/theme-provider"
import Homepage from '../components/Homepage'
import { useAuth } from './AuthContext';
import Profile from './Profile';
function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {isAuthenticated ? <Profile />  : <Homepage />}
    </ThemeProvider>
  )
}

export default Index