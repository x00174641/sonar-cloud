import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { bouncy } from 'ldrs'

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
            <h1 className="text-center text-2xl" style={{ marginTop: '50px', marginBottom: '20px' }}>Recommended Videos</h1>
            <div className="flex flex-wrap items-center justify-center">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full w-[1500px]"
                >
                    <CarouselContent>
                        {randomVideos.map((video, index) => (
                            <CarouselItem
                                key={index}
                                className={`md:basis-1/2 lg:basis-1/3`}
                            >
                                <Card className="flex items-center justify-center" style={{ marginTop: '50px' }}>
                                    <a href={`/clip/${video.videoID}`}>
                                        <video className={`rounded-lg ${index === activeIndex ? '-translate-y-8 opacity-100 duration-1000  ease-in-out' : 'hover:duration-300 hover:opacity-60 opacity-30 mb-2'}`}>
                                            <source src={`https://cliprbucket.s3.amazonaws.com/videos/${video.videoID}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </a>
                                </Card>

                                <div className="text-center p-2">
                                    <a href={`/clip/${video.videoID}`}>

                                        <p className="font-bold text-2sm">{video.title}</p>
                                        <p className="text-muted-foreground text-xs">{video.username}</p>
                                        <p className="text-muted-foreground text-xs">{video.total_views} views | {video.uploaded_date}</p>
                                        {video.tags?.map((tag, tagIndex) => (
                                            <Badge
                                                key={tagIndex}
                                                className={`text-xs ${tagIndex !== 0 ? 'ml-2' : ''}`}
                                            >
                                                {tag}
                                            </Badge>
                                        )) ?? []}
                                    </a>

                                </div>

                            </CarouselItem>
                        ))}

                    </CarouselContent>
                    <CarouselPrevious onExternalClick={decrementActiveIndex} />
                    <CarouselNext onExternalClick={incrementActiveIndex} />
                </Carousel>

                <Separator className="my-4 w-[1700px]" />

                <div className="flex flex-wrap items-center justify-center">
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
                                                <div className="flex flex-wrap">
                                                    {videoDetails.tags?.map((tag, tagIndex) => (
                                                        <Badge
                                                            key={tagIndex}
                                                            className={`text-xs ${tagIndex !== 0 ? 'ml-2' : ''}`}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )) ?? []}
                                                </div>
                                            </div>
                                        )}
                                    </a>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
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
