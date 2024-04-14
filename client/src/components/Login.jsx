import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsInvalid(false);
  }, [username, password]);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api.clipr.solutions/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log(data)
      if (response.status == 403) {
        console.log(response.status)
        window.location.href = `/confirm_user/${username}`;
      } else {
        toast({
          title: "Error",
          description: `${data.error}`,
          status: "success",
          variant: "destructive"
        });
      }
      if (response.status === 200) {
        localStorage.setItem('accessToken', data.accessToken);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
          status: "success",
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsInvalid(true);
    }
  };
  
  return (
    <div>
      <div className="px-4 py-2">
        <DialogHeader>
          <div className="grid gap-4 py-4">
            <div className={`grid grid-cols-4 items-center gap-4 ${isInvalid ? 'text-red-500' : ''}`}>
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input 
                id="username" 
                placeholder="Clipr Username" 
                className={`col-span-3 ${isInvalid ? 'border-red-500' : ''}`} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={`grid grid-cols-4 items-center gap-4 ${isInvalid ? 'text-red-500' : ''}`}>
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Clipr Password" 
                className={`col-span-3 ${isInvalid ? 'border-red-500' : ''}`} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <DialogClose asChild>
              <div className="flex justify-center items-center">
                <Button className="w-1/2 justify-center" onClick={handleLogin}>Login</Button>
              </div>
            </DialogClose>
          </div>
        </DialogHeader>
      </div>
    </div>
  );
}

export default Login;
