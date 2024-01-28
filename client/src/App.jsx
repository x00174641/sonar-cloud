import { useState } from 'react'
import  Home  from "@/components/Header"
import { ThemeProvider } from "@/components/theme-provider"
import Container from './components/ui/container'
import Homepage from './components/Homepage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="App">
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home/>
        <Container>
          <Homepage/>
        </Container>
    </ThemeProvider>
    </div>
  )
}

export default App
