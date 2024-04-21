import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";

const Header = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`https://api.clipr.solutions/search?title=${searchQuery}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

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
            <div className="relative w-1/2 glass">
                <Input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 rounded-md focus:outline-none w-full bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-stone-900 shadow-md rounded mt-1">
                        <ul className="py-2">
                            {searchResults.slice(0, 5).map((result, index) => (
                                <a href={`/clip/${result.videoID}`}>
                                    <li className="flex justify-between items-center px-4 py-2 hover:bg-stone-800 rounded">
                                    <span>{result.title}</span>
                                    <span className='text-muted-foreground text-sm'>{result.total_views} views</span>
                                </li></a>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isAuthenticated ? (
                <>
                    <div className="flex items-center">
                        <a href="/discovery">
                            <FontAwesomeIcon
                                icon={faSearch}
                                size="2x"
                                className="mr-7"
                            />
                        </a>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                </>
            ) : (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center">
                                <a href="/discovery">
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        size="2x"
                                        className="mr-7"
                                    />
                                </a>
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
