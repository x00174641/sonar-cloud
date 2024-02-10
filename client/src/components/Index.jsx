import { ThemeProvider } from "@/components/theme-provider"
import Homepage from '../components/Homepage'
import { useAuth } from './AuthContext';
import Profile from './Profile';
import Header from './Header';
import { Toaster } from "@/components/ui/toaster"
import Providers  from "@/components/provider";
function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Providers>
      <Header />
        {isAuthenticated ? <Profile />  : <Homepage />}
        <Toaster />
      </Providers>
    </ThemeProvider>
  )
}

export default Index
