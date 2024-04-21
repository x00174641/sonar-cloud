import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserChannelGet from '../hooks/FetchUserChannel';
import useFollowUser from '../hooks/FollowUser';
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserChannel() {
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
    <div className="w-full min-h-screen dark:text-gray-50 ">
      <header className="shadow-sm">
        <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between  mt-32">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage alt={`@${username}`} src={`https://ui-avatars.com/api/?uppercase=true&name=${username}`} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold text-xl">@{username}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.followerCount} </span>
              Followers
            </div>
            <Button className='cursor-pointer' onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>
          </div>
        </div>
      </header>
      <UserChannelGet />
    </div>
  )
}
