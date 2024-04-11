import React from 'react';
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"


const Header = ({ children }) => {
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
        <nav className="p-4 flex justify-between items-center transparent fixed top-0 w-full z-10">
            <div className="flex items-center">
                <a href="/"><span className="text-white font-semibold text-2xl">CLIPR SOLUTIONS</span></a>
            </div>
            {isAuthenticated ? (
                <>
                    <div className="flex items-center">

                        <a href="/discovery"><FontAwesomeIcon
                            icon={faSearch}
                            size="2x"
                            className="mr-7"
                        /></a>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                </>
            ) : (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center">
                                <a href="/discovery"><FontAwesomeIcon
                                    icon={faSearch}
                                    size="2x"
                                    className="mr-7"
                                /></a>
                                <Button>Login</Button>

                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] outline-none">
                            <Tabs defaultValue="Login" className="w-[370px] outline-none">
                                <TabsList className="grid w-full grid-cols-2 outline-none">
                                    <TabsTrigger value="Login">Login</TabsTrigger>
                                    <TabsTrigger value="Signup">Sign up</TabsTrigger>
                                </TabsList>
                                <TabsContent className="outline-none" value="Login">
                                    <Login />
                                </TabsContent>
                                <TabsContent className="outline-none" value="Signup">
                                    <Signup />
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </>
            )}
            {children}
        </nav>
    );
};

export default Header;
