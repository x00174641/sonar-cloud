import { useState, useEffect } from 'react';

const FetchUserProfileVideos = (decodedToken) => {
  const [videos, setVideos] = useState([]);
  const [videoInfo, setVideoInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!decodedToken || !decodedToken.username) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.clipr.solutions/user/channel/@${decodedToken.username}`, {
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

  useEffect(() => {
    fetchData();
  }, [decodedToken]);

  useEffect(() => {
    const getVideoInfo = async (videoId) => {
      try {
        const response = await fetch(`https://api.clipr.solutions/videos/${videoId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch video info');
        }
        return await response.json();
      } catch (error) {
        console.error(error);
        return {};
      }
    };

    const fetchVideoInfos = async () => {
      const infoPromises = videos.map((video) => getVideoInfo(video));
      const info = await Promise.all(infoPromises);
      const videoInfoMap = {};
      info.forEach((item, index) => {
        videoInfoMap[videos[index]] = item;
      });
      setVideoInfo(videoInfoMap);
    };

    if (videos.length) {
      fetchVideoInfos();
    }
  }, [videos]);

  return { videos, videoInfo, isLoading, refreshVideos: fetchData };
};

export default FetchUserProfileVideos;
