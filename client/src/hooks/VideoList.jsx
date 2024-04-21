import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Card, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaChartLine } from "react-icons/fa";
import EditVideo from "@/components/EditVideo";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import useJwtDecode from '../hooks/TokenDecoder';
import LineChart from './VideoLineChart';

const VideoList = ({ videos, videoInfo, isLoading, refreshData }) => {
  const token = localStorage.getItem('accessToken');
  const decodedToken = useJwtDecode(token);
  const incrementView = async (videoId) => {
    try {
      const response = await fetch(`https://api.clipr.solutions/view_increment/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoID: videoId, username: decodedToken.username }),
      });

      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link: ', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap" style={{ paddingBottom: '100px' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <Skeleton className="h-64" />
            <Skeleton className="mt-2 h-6 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {videos.map((video, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
          <Dialog>
            <DialogTrigger asChild>
              <Card onClick={() => incrementView(video)}>
                <video
                  className='rounded-lg'
                >
                  <source src={`https://cliprbucket.s3.amazonaws.com/videos/${video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Card>
            </DialogTrigger>
            <CardDescription>
              <h1 className='ml-5 mt-4 text-base font-bold'>{videoInfo[video]?.title}</h1>
              <div className="flex items-center">
                <p className='ml-5 text-sm italic'>{videoInfo[video]?.total_views} views | Uploaded on {videoInfo[video]?.uploaded_date}</p>
                <Drawer>
                  <DrawerTrigger asChild>
                    <FaChartLine className='ml-7 mr-3 mb-2' size={18} />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Video Stats</DrawerTitle>
                      <div className="mt-3 h-[300px] w-[800px] mb-7">
                      <LineChart videoInfo={videoInfo} video={video} />
                      </div>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
                <EditVideo videoID={video} refreshData={refreshData} />
              </div>
            </CardDescription>
            <DialogContent className="sm:max-w-[1000px]">
              <video className='rounded-lg' controls autoPlay muted>
                <source src={`https://cliprbucket.s3.amazonaws.com/videos/${video}`} type="video/mp4" />
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
                    <Button type="button" size="sm" className="px-3" onClick={() => handleCopyLink(`http://localhost:5173/clip/${video}`)}>
                      {linkCopied ? "Copied" : <FaCopy className="h-4 w-4" />}
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
      ))}
    </div>
  );
};

export default VideoList;
