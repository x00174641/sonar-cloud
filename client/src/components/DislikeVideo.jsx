import React, { useState } from 'react';
import { SlDislike } from "react-icons/sl";
import { useAuth } from './AuthContext';
import Login from './Login';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Signup from "@/components/Signup";

const DislikeVideoButton = ({ videoID, onDislike }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const dislikeVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions/api/dislike/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ videoID }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.json();
            console.log('Success:', content);

            if (onDislike) {
                onDislike();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <SlDislike size="24" onClick={dislikeVideo} disabled={loading} />
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <SlDislike size="24" />
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
            )}
        </div>
    );
};

export default DislikeVideoButton;
