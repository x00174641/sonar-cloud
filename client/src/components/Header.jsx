import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
const containerStyle = {
    fontSize: '1.1rem',
    margin: '0 auto',
    maxWidth: '550px',
    marginTop: '30px',
};
import { useAuth } from './AuthContext';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        window.location.reload(true);
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
                            <h1 className="text-muted-foreground">Home</h1>
                        </div>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <div className="px-4 py-2">
                            <h1 className="text-muted-foreground">About</h1>
                        </div>
                    </NavigationMenuItem>

                    {isAuthenticated ? (
                        <>
                            <NavigationMenuItem>
                                <div className="px-4 py-2">
                                    <h1 className="text-muted-foreground">Profile</h1>
                                </div>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <div className="px-4 py-2" onClick={logout}>
                                    <h1 className="text-muted-foreground">Logout</h1>
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
