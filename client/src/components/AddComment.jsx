import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';
import Login from './Login';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import Signup from "@/components/Signup";

function AddComment({ videoID, onCommentPosted }) {
    const [comment, setComment] = useState('');
    const { toast } = useToast();
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions/api/comment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ videoID, comment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (typeof onCommentPosted === 'function') {
                onCommentPosted();
            }

            toast({
                title: `Your comment has been added!`,
                status: "success",
            });

            setComment('');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <Textarea
                        className="mb-2"
                        placeholder="Add your comment here."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <DialogFooter>
                        <Button className="comment-button" onClick={handleSubmit}>Comment</Button>
                    </DialogFooter>
                </div>
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <div>
                            <Textarea
                                className="mb-2"
                                placeholder="Add your comment here."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <DialogFooter>
                                <Button className="comment-button">Comment</Button>
                            </DialogFooter>
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
            )}
        </div>
    );
}

export default AddComment;
