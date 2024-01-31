import React, { useState, useEffect } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import VideoContainer from './ui/VideoContainer';
import Image from './download.png'

function Profile() {  
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const [videos, setVideos] = useState([]);

  const fetchData = async () => {
    if (!decodedToken || !decodedToken.username) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/user/channel/@${decodedToken.username}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setVideos(data.video_list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [decodedToken]);

  if (!decodedToken) {
    return null; 
  }

  return (
    <div>
     <VideoContainer>
       <div className="flex items-center">
         <div className="ml-7 w-32 h-32">
           <img
             src={Image}
             alt={`${decodedToken.username}'s profile`}
             className="rounded-full mb-5"
           />
         </div>
         <div className="ml-7">
           <h2 className='text-2xl text-muted-foreground'>@{decodedToken.username}</h2>
         </div>
       </div>

       <div className="flex flex-wrap justify-center mt-6 mb-6">
         {videos.map((video, index) => (
           <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 ">
             <Card>
               <video className='rounded-lg border-white'>
                 <source src={`https://cliprbucket.s3.amazonaws.com/videos/videos/${video}`} type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
               <CardTitle>
                 <h1>TITLE</h1>
               </CardTitle>
               <CardDescription>
                 <p>description</p>
               </CardDescription>
             </Card>
           </div>
         ))}
       </div>
     </VideoContainer>
     

    </div>
  );    
}

export default Profile;
