import React, { useState, useEffect } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';
import FetchUserProfileVideos from '../hooks/FetchUserProfileData';
import VideoList from '../hooks/VideoList';
import UserSettings from './Settings';
import VideoContainer from './ui/VideoContainer';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";


function Profile() {
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const { videos, videoInfo, isLoading, refreshVideos } = FetchUserProfileVideos(decodedToken);
  const [view, setView] = useState('Profile');

  const [userData, setUserData] = useState({
    followerCount: 0,
    totalViews: 0,
    totalVideos: 0
  });

  useEffect(() => {
    if (decodedToken) {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://api.clipr.solutions/user/channel/${decodedToken.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData({
            followerCount: data.follower_count,
            totalViews: data.total_views,
            totalVideos: data.total_videos
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }
  }, [decodedToken]);

  if (!decodedToken) {
    return null;
  }

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <VideoContainer>
        <div className="flex items-center mt-44">
          <div className="ml-7">
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Card className="mr-10"style={{ width: '30%', textAlign: 'center' }}>
                <CardContent>
                  <div style={{ fontSize: '44px', fontWeight: 'bold' }}>@{decodedToken.username}</div>
                </CardContent>
              </Card>
              <Card className="mr-10" style={{ width: '30%', textAlign: 'center' }}>
                <CardContent>
                  <div style={{ fontSize: '34px', }}>{userData.followerCount}</div>
                  <CardTitle className='text-muted-foreground text-lg'>Followers</CardTitle>
                </CardContent>
              </Card>
              <Card className="mr-10" style={{ width: '30%', textAlign: 'center' }}>
                <CardContent>
                  <div style={{ fontSize: '34px', }}>{userData.totalViews}</div>
                  <CardTitle className='text-muted-foreground text-lg'>Views</CardTitle>
                </CardContent>
              </Card>
              <Card className="mr-10" style={{ width: '30%', textAlign: 'center' }}>
                <CardContent>
                  <div style={{ fontSize: '34px', }}>{userData.totalVideos}</div>
                  <CardTitle className='text-muted-foreground text-lg'>Videos</CardTitle>
                </CardContent>
              </Card>
            </div>
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
