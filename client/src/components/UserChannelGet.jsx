import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserChannelGet from '../hooks/FetchUserChannel';
import VideoContainer from './ui/VideoContainer';
import { Separator } from "@/components/ui/separator";
import useFollowUser from '../hooks/FollowUser';
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

function UserChannel() {
  const { username } = useParams();
  const { isFollowing, followUser, unfollowUser } = useFollowUser({ username });
  const [userData, setUserData] = useState({
    followerCount: 0,
    totalViews: 0,
    totalVideos: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.clipr.solutions/user/channel/${username}`);
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
  }, [username]);

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  return (
    <div>
      <VideoContainer>
        <div className="flex items-center mt-44">
          <div className="ml-7">
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Card className="mr-10"style={{ width: '30%', textAlign: 'center' }}>
                <CardContent>
                  <div style={{ fontSize: '44px', fontWeight: 'bold' }}>@{username}</div>
                    <CardTitle className='text-lg underline cursor-pointer'  onClick={handleFollow} >{isFollowing ? 'Unfollow' : 'Follow'}</CardTitle>
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
      </VideoContainer>
      <UserChannelGet />
    </div>
  );
}

export default UserChannel;
