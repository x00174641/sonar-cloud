import React, { useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import VideoContainer from "./ui/VideoContainer";
import { useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Redirect from "../hooks/Redirect";
import { bouncy } from 'ldrs';

function ConfirmCode() {
  const [value, setValue] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  let { username } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (value.length === 6) {
      handleConfirmation();
    }
  }, [value]);

  const handleConfirmation = async () => {
    try {
      setRedirecting(true);
      const response = await fetch(`https://api.clipr.solutions/confirm_user_by_code/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: value })
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data.success);
        toast({
          title: "Confirmation Code Success",
          description: `${data.success}\nYou can login successfully now.`,
          status: "success",
        });
        setTimeout(() => {
            window.location.href = "/"; 
          }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Confirmation Code Failed",
          description: `${data.error}`,
          status: "error",
        });
        console.log(data.error);
        setRedirecting(false);
      }
    } catch (error) {
      console.error('Error confirming user:', error);
      toast({
        variant: "destructive",
        title: "Confirmation Code Failed",
        description: `${error}`,
        status: "error",
      });
      setRedirecting(false);
    }
  };

  return (
    <div>
      {redirecting && (
        <Redirect />
      )}
      {!redirecting && (
        <div>
          <div className="flex justify-center items-center mt-20 mb-5">
            <p>Please enter the verification code below.</p>
          </div>
          <div className="flex justify-center items-center">
            <VideoContainer>
              <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </VideoContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmCode;
