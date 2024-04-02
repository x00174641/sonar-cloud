import React from 'react';
import { useParams } from 'react-router-dom';
import UserChannelGet from '../hooks/FetchUserChannel';
import VideoContainer from './ui/VideoContainer';
import { Separator } from "@/components/ui/separator"
import Image from './download.png';

function UserChannel() {
    const { username } = useParams();
  return (
    <div>
        
        <VideoContainer>
        <div className="flex items-center">
          <div className="ml-7 w-32 h-32">
            <img
              src={Image}
              alt={`${username}'s profile`}
              className="rounded-full mb-5"
            />
          </div>
          <div className="ml-7">
            <h2 className='text-2xl text-muted-foreground'>@{username}</h2>
          </div>
        </div>
        <Separator className="my-5" />
      </VideoContainer>
      <UserChannelGet />
    </div>
  );
}

export default UserChannel;
