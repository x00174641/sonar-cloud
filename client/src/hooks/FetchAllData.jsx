import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { bouncy } from 'ldrs'
import { Input } from "@/components/ui/input";
import VideoContainer from '../components/ui/VideoContainer'
function VideosComponent() {
    const [videoIDs, setVideoIDs] = useState([]);
    const [randomVideos, setRandomVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [videos, setVideos] = useState({});
    bouncy.register()

    useEffect(() => {
        const fetchVideoIDs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://api.clipr.solutions/api/getVideos');
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const data = await response.json();
                setVideoIDs(data.video_list);
                fetchVideoDetails(data.video_list);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        const fetchVideoDetails = async (videoList) => {
            try {
                const videosWithDetails = await Promise.all(videoList.map(async (videoID) => {
                    const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch video info for ${videoID}`);
                    }
                    const videoInfo = await response.json();
                    return { videoID, ...videoInfo };
                }));
                const videosObject = videosWithDetails.reduce((acc, video) => {
                    acc[video.videoID] = video;
                    return acc;
                }, {});
                setVideos(videosObject);
                setRandomVideos(videosWithDetails);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchVideoIDs();
    }, []);

    const incrementActiveIndex = () => {
        setActiveIndex((prevActiveIndex) => {
            const nextIndex = prevActiveIndex + 1;
            return nextIndex < randomVideos.length ? nextIndex : 0;
        });
    };

    const decrementActiveIndex = () => {
        setActiveIndex((prevActiveIndex) => {
            const prevIndex = prevActiveIndex - 1;
            return prevIndex >= 0 ? prevIndex : randomVideos.length - 1;
        });
    };

    if (isLoading) return <div><LoadingOverlay /></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>

            <VideoContainer>
               
                <div className="flex flex-wrap items-center justify-center mt-44">
                    {videoIDs.map((videoID, index) => {
                        const videoDetails = videos[videoID];
                        return (
                            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-5">
                                <Card>
                                    <a href={`/clip/${videoID}`}>
                                        <video className='rounded-lg hover:duration-300 hover:opacity-60'>
                                            <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        {videoDetails && (
                                            <div className=" p-2">
                                                <p className="font-bold text-sm">{videoDetails.title}</p>
                                                <p className="text-muted-foreground text-xs">{videoDetails.username}</p>
                                                <p className="text-muted-foreground text-xs">{videoDetails.total_views} views | {videoDetails.uploaded_date}</p>
                                            </div>
                                        )}
                                    </a>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </VideoContainer>
        </>
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
export default VideosComponent;
