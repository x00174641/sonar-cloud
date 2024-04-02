import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaChartLine } from "react-icons/fa";
import { bouncy } from 'ldrs'

function useUserChannelVideos(username) {
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    bouncy.register()

    useEffect(() => {
        const fetchUserChannelVideos = async () => {
            try {
                const response = await fetch(`https://api.clipr.solutions/user/channel/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch video list');
                }
                const data = await response.json();
                setVideoList(data.video_list);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        // Simulate a delay of 2 seconds before setting loading to false
        const delay = setTimeout(() => {
            fetchUserChannelVideos();
        }, 500);

        return () => clearTimeout(delay);

    }, [username]);

    return { videoList, loading, error };
}

function useVideoInfo(videoID) {
    const [videoInfo, setVideoInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoInfo = async () => {
            try {
                const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch video data');
                }
                const data = await response.json();
                setVideoInfo(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchVideoInfo();

    }, [videoID]);

    return { videoInfo, loading, error };
}

function UserChannelGet() {
    const { username } = useParams();
    const { videoList, loading: videoListLoading, error: videoListError } = useUserChannelVideos(username);

    if (videoListError) {
        return <div>Error: {videoListError.message}</div>;
    }

    return (
        <div className="relative flex flex-wrap">
            {videoList.map((videoID, index) => (
                <Video key={index} videoID={videoID} />
            ))}
            {videoListLoading && <LoadingOverlay />}
        </div>
    );
}

function Video({ videoID }) {
    const { videoInfo, loading: videoInfoLoading, error: videoInfoError } = useVideoInfo(videoID);

    if (videoInfoError) {
        return <div>Error: {videoInfoError.message}</div>;
    }

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Card>
                        <video
                            className='rounded-lg'
                        >
                            <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`} />
                            Your browser does not support the video tag.
                        </video>
                    </Card>
                </DialogTrigger>
                <CardDescription>
                    <h1 className='ml-5 mt-4 text-base font-bold'>{videoInfo ? videoInfo.title : 'Loading...'}</h1>
                    <div className="flex items-center">
                        <p className='ml-5 text-sm italic'>{videoInfo ? `${videoInfo.total_views} views | Uploaded on ${videoInfo.uploaded_date}` : 'Loading...'}</p>
                    </div>
                </CardDescription>
                <DialogContent className="sm:max-w-[1000px]">
                    <video className='rounded-lg' controls autoPlay muted>
                        <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`} type="video/mp4" />
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
                                        defaultValue={`http://localhost:5173/clip/${videoID}`}
                                        readOnly
                                    />
                                </div>
                                <Button type="submit" size="sm" className="px-3">
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
    );
}

function LoadingOverlay() {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50">
            <l-bouncy
                size="45"
                speed="1.75"
                color="white"
            ></l-bouncy>
        </div>
    );
}



export default UserChannelGet;
