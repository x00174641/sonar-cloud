import React, { useState, useEffect } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';
import { Card, CardDescription } from "@/components/ui/card";
import VideoContainer from './ui/VideoContainer';
import Image from './download.png';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FaChartLine } from "react-icons/fa";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaCopy } from "react-icons/fa";
import UserSettings from './Settings';
import { Separator } from "@/components/ui/separator"

function Profile() {
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const [videos, setVideos] = useState([]);
  const [videoInfo, setVideoInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!decodedToken || !decodedToken.username) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const incrementView = async (videoId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/view_increment/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "videoID": videoId, 'username': decodedToken.username }),
      });

      if (!response.ok) {
        throw Error('Failed to increment view count');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getVideoInfo = async (videoId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/videos/${videoId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  const [view, setView] = useState('Profile');

  const switchView = (newView) => {
    setView(newView);
  };

  useEffect(() => {
    fetchData();
  }, [decodedToken]);

  useEffect(() => {
    const videoInfoPromises = videos.map((video) => getVideoInfo(video));
    Promise.all(videoInfoPromises).then((info) => {
      const videoInfoMap = {};
      info.forEach((item, index) => {
        videoInfoMap[videos[index]] = item;
      });
      setVideoInfo(videoInfoMap);
    });
  }, [videos]);

  if (!decodedToken) {
    return null;
  }

  return (
    <div>
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
          <Separator className="my-5" />
          <div className="flex h-5 items-center space-x-5 text-sm">
            <div className="ml-12 hover:text-gray-400 cursor-pointer" onClick={() => switchView('Profile')}>Profile</div>
            <Separator orientation="vertical" />
            <div className='hover:text-gray-700 cursor-pointer' onClick={() => switchView('Settings')}>Account Settings</div>
          </div>
        </VideoContainer>
      </div>

      {view === 'Profile' ? (
        <div className='mt-20'>
          <VideoContainer>
            <div className="flex flex-wrap justify-center mt-6 mb-6">
              {isLoading ? (
                Array.from({ length: videos.length || 4 }).map((_, index) => (
                  <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="mt-2 h-6 w-3/4" />
                  </div>
                ))
              ) : (
                videos.map((video, index) => (
                  <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 ">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card>
                          <video
                            className='rounded-lg'
                            onClick={() => incrementView(video)}
                          >
                            <source src={`https://cliprbucket.s3.amazonaws.com/videos/videos/${video}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </Card>
                      </DialogTrigger>
                      <CardDescription>
                        <div className="flex items-center">
                          <p className='ml-7 mt-4'>{videoInfo[video]?.total_views} views | Uploaded on {videoInfo[video]?.uploaded_date}</p>
                          <Drawer>
                            <DrawerTrigger asChild>
                              <FaChartLine className='ml-7 mt-4' size={18} />
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Video Stats</DrawerTitle>
                                <DrawerDescription>
                                  <div className="flex items-center">
                                    <p>{videoInfo[video]?.total_views} views</p>
                                    <FaChartLine size={16} className="ml-2" />
                                  </div>
                                </DrawerDescription>
                              </DrawerHeader>
                            </DrawerContent>
                          </Drawer>
                        </div>
                      </CardDescription>
                      <DialogContent className="sm:max-w-[1000px]">
                        <video className='rounded-lg' controls autoPlay muted>
                          <source src={`https://cliprbucket.s3.amazonaws.com/videos/videos/${video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Share</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogTitle>Share video</DialogTitle>
                            <div className="flex items-center space-x-2">
                              <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                  Link
                                </Label>
                                <Input
                                  id="link"
                                  defaultValue={`http://localhost:5173/clip/${video}`}
                                  readOnly
                                />
                              </div>
                              <Button type="submit" size="sm" className="px-3">
                                <span className="sr-only">Copy</span>
                                <FaCopy className="h-4 w-4" />
                              </Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              )}
            </div>
          </VideoContainer>
        </div>
      ) : (
        <UserSettings />
      )}
    </div>
  );
};

export default Profile;
