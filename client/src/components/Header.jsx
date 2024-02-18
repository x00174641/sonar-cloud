import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast"
const containerStyle = {
    fontSize: '1.1rem',
    margin: '0 auto',
    maxWidth: '500px',
    marginTop: '30px',
};
function Header() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const { toast } = useToast();

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        toast({
            title: "Logout Successful",
            description: "You are now logged out.",
            status: "success",
          });
    };

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
                            <h1 className="text-muted-foreground hover:text-gray-600 cursor-pointer">Discover</h1>
                        </div>
                    </NavigationMenuItem>

                    {isAuthenticated ? (
                        <>
                            <NavigationMenuItem>
                                <div className="px-4 py-2" onClick={logout}>
                                    <h1 className="text-muted-foreground hover:text-gray-600 cursor-pointer">Logout</h1>
                                </div>
                            </NavigationMenuItem>
                        </>
                    ) : (
                        <>
                            <NavigationMenuItem>
                                <Login />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Signup />
                            </NavigationMenuItem>
                        </>
                    )}

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
