import React, { useState, useEffect } from 'react';
import useJwtDecode from '../hooks/TokenDecoder';
import { Card, CardDescription } from "@/components/ui/card";
import VideoContainer from './ui/VideoContainer';
import Image from './download.png';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {Drawer,DrawerContent,DrawerDescription,DrawerHeader,DrawerTitle,DrawerTrigger} from "@/components/ui/drawer";
import { FaChartLine } from "react-icons/fa";

function Profile() {
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const [videos, setVideos] = useState([]);
  const [videoInfo, setVideoInfo] = useState({});

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

  const incrementView = async (videoId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/view_increment/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "videoID": videoId }),
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
                          <DrawerTitle>Move Goal</DrawerTitle>
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
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </VideoContainer>
    </div>
  );
}

export default Profile;
