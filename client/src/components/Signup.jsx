import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast(); 
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            const response = await fetch('https://api.clipr.solutions/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                }),
            });


            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                toast({
                    title: "Error:",
                    description: `${data}`,
                    status: "error",
                });
            } else {
                toast({
                title: data.message,
                status: "success",
                });
                window.location.href = `/confirm_user/${username}`;
            }

        } catch (error) {
            toast({
                title: "Error:",
                description: error.toString(),
                status: "error",
            });
        }
    };

    return (
        <div className="px-4 py-2">
               
                        <DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Email" className="text-right">
                                        Email
                                    </Label>
                                    <Input type="email" id="Email" placeholder="Email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input id="username" placeholder="Clipr Username" className="col-span-3" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right">
                                        Password
                                    </Label>
                                    <Input type="password" id="password" placeholder="Clipr Password" className="col-span-3" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="flex justify-center items-center">
                                    <Button className="w-1/2 justify-center" onClick={handleSubmit}>Sign up</Button>
                                </div>
                            </div>
                        </DialogHeader>
  
        </div>
    );
}

export default Signup;
