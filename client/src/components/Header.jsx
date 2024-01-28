import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components/mode-toggle"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Login from "@/components/Login"
import Signup from "@/components/Signup"
const containerStyle = {
    fontSize: '1.1rem',
    margin: '0 auto',
    maxWidth: '550px',
    marginTop: '30px',
};

function Header() {
    return (
        <header style={containerStyle}>
            
            <NavigationMenu>
                <NavigationMenuList>
                    
                    <NavigationMenuItem>
                        <div className="text-2xl font-bold px-4 py-2">
                            CLIPR
                        </div>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <div className="px-4 py-2">
                            <h1 className="text-muted-foreground">Home</h1>
                        </div>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <div className="px-4 py-2">
                            <h1 className="text-muted-foreground">About</h1>
                        </div>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                    <Login/>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Signup/>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <div className="px-4 py-2">
                            <ModeToggle />
                        </div>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
}

export default Header;
