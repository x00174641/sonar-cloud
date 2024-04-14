import React, { useState } from 'react';
import { AiOutlineLike } from "react-icons/ai";
import { useAuth } from './AuthContext';
import Login from './Login';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Signup from "@/components/Signup";

const LikeVideoButton = ({ videoID, onLike }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const likeVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions/api/like/', {
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

            if (onLike) {
                onLike();
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
                <>
                    <AiOutlineLike size="24" onClick={likeVideo} disabled={loading}>
                    </AiOutlineLike>
                </>
            ) : (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <AiOutlineLike size="24" disabled={loading}>
                            </AiOutlineLike>
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
        </div>
    );
};

export default LikeVideoButton;
