import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"

const VideoDeleteButton = ({ videoID, refreshData }) => {
  const { toast } = useToast();

  const deleteVideo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete/videos/?videoID=${videoID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 200) {
        toast({
          title: `Successful, deleted ${videoID}!`,
          status: "success",
        });
        refreshData();
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong...",
          description: result.error,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong...",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Button onClick={deleteVideo}>Delete Video</Button>
  );
};

export default VideoDeleteButton;
