import React, { useState, useEffect } from "react";
import { bouncy } from 'ldrs';
import useJwtDecode from '../hooks/TokenDecoder';

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

  const decodedToken = useJwtDecode(localStorage.getItem('accessToken'));

  const incrementView = async (videoID, username) => {
    try {
      await fetch(`https://api.clipr.solutions/view_increment/${videoID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoID, username })
      });
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  return (
    <div className="w-full px-4 mx-auto grid grid-rows-[auto_1fr_auto] gap-4 md:gap-6 pb-10 mt-44">
      <main className="grid md:grid-cols-6 gap-10 items-start">
        <div className="col-span-4 grid gap-4">
          <div className="grid gap-4">
            <h2 className="font-semibold text-xl">Popular Videos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {randomVideos.map((video, index) => (
                <div key={index} className="relative group grid [grid-template-areas:stack] overflow-hidden rounded-lg">
                  <a className="absolute inset-0 z-10" href={`/clip/${video.videoID}`} onClick={() => incrementView(video.videoID, decodedToken.username)}>
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
                  <a className="absolute inset-0" href="#" onClick={() => incrementView(video.videoID, decodedToken.username)}>
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
