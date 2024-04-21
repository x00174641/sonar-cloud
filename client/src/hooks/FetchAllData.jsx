import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { bouncy } from 'ldrs'
import { Input } from "@/components/ui/input";
import VideoContainer from '../components/ui/VideoContainer'
// function VideosComponent() {
//     const [videoIDs, setVideoIDs] = useState([]);
//     const [randomVideos, setRandomVideos] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeIndex, setActiveIndex] = useState(1);
//     const [videos, setVideos] = useState({});
//     bouncy.register()

//     useEffect(() => {
//         const fetchVideoIDs = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await fetch('https://api.clipr.solutions/api/getVideos');
//                 if (!response.ok) {
//                     throw new Error('Something went wrong!');
//                 }
//                 const data = await response.json();
//                 setVideoIDs(data.video_list);
//                 fetchVideoDetails(data.video_list);
//             } catch (err) {
//                 setError(err.message);
//                 setIsLoading(false);
//             }
//         };

//         const fetchVideoDetails = async (videoList) => {
//             try {
//                 const videosWithDetails = await Promise.all(videoList.map(async (videoID) => {
//                     const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch video info for ${videoID}`);
//                     }
//                     const videoInfo = await response.json();
//                     return { videoID, ...videoInfo };
//                 }));
//                 const videosObject = videosWithDetails.reduce((acc, video) => {
//                     acc[video.videoID] = video;
//                     return acc;
//                 }, {});
//                 setVideos(videosObject);
//                 setRandomVideos(videosWithDetails);
//                 setIsLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setIsLoading(false);
//             }
//         };

//         fetchVideoIDs();
//     }, []);

//     const incrementActiveIndex = () => {
//         setActiveIndex((prevActiveIndex) => {
//             const nextIndex = prevActiveIndex + 1;
//             return nextIndex < randomVideos.length ? nextIndex : 0;
//         });
//     };

//     const decrementActiveIndex = () => {
//         setActiveIndex((prevActiveIndex) => {
//             const prevIndex = prevActiveIndex - 1;
//             return prevIndex >= 0 ? prevIndex : randomVideos.length - 1;
//         });
//     };

//     if (isLoading) return <div><LoadingOverlay /></div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <>

//             <VideoContainer>
               
//                 <div className="flex flex-wrap items-center justify-center mt-44">
//                     {videoIDs.map((videoID, index) => {
//                         const videoDetails = videos[videoID];
//                         return (
//                             <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-5">
//                                 <Card>
//                                     <a href={`/clip/${videoID}`}>
//                                         <video className='rounded-lg hover:duration-300 hover:opacity-60'>
//                                             <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`} type="video/mp4" />
//                                             Your browser does not support the video tag.
//                                         </video>
//                                         {videoDetails && (
//                                             <div className=" p-2">
//                                                 <p className="font-bold text-sm">{videoDetails.title}</p>
//                                                 <p className="text-muted-foreground text-xs">{videoDetails.username}</p>
//                                                 <p className="text-muted-foreground text-xs">{videoDetails.total_views} views | {videoDetails.uploaded_date}</p>
//                                             </div>
//                                         )}
//                                     </a>
//                                 </Card>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </VideoContainer>
//         </>
//     );
// }
// function LoadingOverlay() {
//     return (
//         <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50">
//             <l-bouncy
//                 size="45"
//                 speed="1.75"
//                 color="white"
//             ></l-bouncy>
//         </div>
//     );
// }

// export default VideosComponent;

export default function VideosComponent() {
    const [videoIDs, setVideoIDs] = useState([]);
    const [randomVideos, setRandomVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [videos, setVideos] = useState({});
    bouncy.register();
  
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
          const sortedVideos = videosWithDetails.sort((a, b) => b.total_views - a.total_views);
          const videosObject = sortedVideos.reduce((acc, video) => {
            acc[video.videoID] = video;
            return acc;
          }, {});
          setVideos(videosObject);
          setRandomVideos(sortedVideos);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };
  
      fetchVideoIDs();
    }, []);
  
    return (
      <div className="w-full px-4 mx-auto grid grid-rows-[auto_1fr_auto] gap-4 md:gap-6 pb-10 mt-44">
        <main className="grid md:grid-cols-6 gap-10 items-start">
          <div className="col-span-4 grid gap-4">
            <div className="grid gap-4">
              <h2 className="font-semibold text-xl">Popular Videos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {randomVideos.map((video, index) => (
                  <div key={index} className="relative group grid [grid-template-areas:stack] overflow-hidden rounded-lg">
                    <a className="absolute inset-0 z-10" href={`/clip/${video.videoID}`}>
                      <span className="sr-only">View</span>
                    </a>
                    <video className="[grid-area:stack] object-cover w-full aspect-video" height={168} width={300}>
                      <source src={`https://cliprbucket.s3.amazonaws.com/videos/${video.videoID}`}></source>
                    </video>
                    {video && (
                      <div className="flex-1 [grid-area:stack] bg-black/70 group-hover:opacity-90 transition-opacity text-white p-4 justify-end flex flex-col gap-2">
                        <h3 className="font-semibold text-lg tracking-tight line-clamp-2">{video.title}</h3>
                        <div className="text-xs text-gray-400 line-clamp-1">{video.username}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{video.total_views} views · {video.uploaded_date}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <div className="col-span-2 grid gap-4">
            <div className="grid gap-4">
              <h2 className="font-semibold text-xl">Recommended Videos</h2>
              {randomVideos.filter(video => video.isRecommended).slice(0, 4).map((video, index) => (
                <div className="grid gap-4" key={index}>
                  <div className="flex items-start gap-4 relative">
                    <a className="absolute inset-0" href="#">
                      <span className="sr-only">View</span>
                    </a>
                    <video className="aspect-video rounded-lg object-cover" height={94} width={168}>
                      <source src={`https://cliprbucket.s3.amazonaws.com/videos/${video.videoID}`}></source>
                    </video>
                    {video && (
                      <div className="text-sm">
                        <div className="font-medium line-clamp-2">{video.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{video.username}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{video.total_views} views · {video.uploaded_date}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }
