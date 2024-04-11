import React, { useState } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';
import FetchUserProfileVideos from '../hooks/FetchUserProfileData';
import VideoList from '../hooks/VideoList';
import UserSettings from './Settings';
import VideoContainer from './ui/VideoContainer';
import { Separator } from "@/components/ui/separator"
import Image from './download.png';

function Profile() {
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const { videos, videoInfo, isLoading, refreshVideos } = FetchUserProfileVideos(decodedToken);
  const [view, setView] = useState('Profile');

  if (!decodedToken) {
    return null;
  }

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <VideoContainer>
        <div className="flex items-center mt-20">
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
        <Separator className="my-5" />
        <div className="flex h-5 items-center space-x-5 text-sm">
          <div className="ml-12 hover:text-gray-400 cursor-pointer" onClick={() => switchView('Profile')}>Profile</div>
          <Separator orientation="vertical" />
          <div className='hover:text-gray-700 cursor-pointer' onClick={() => switchView('Settings')}>Account Settings</div>
        </div>
      </VideoContainer>
      {view === 'Profile' ? (
        <div className='mt-20'>
          <VideoContainer>
            <VideoList videos={videos} videoInfo={videoInfo} isLoading={isLoading} refreshData={refreshVideos} />
          </VideoContainer>
        </div>
      ) : (
        <UserSettings />
      )}
    </div>
  );
};

export default Profile;
