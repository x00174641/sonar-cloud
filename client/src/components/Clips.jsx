import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LikeVideoButton from "../components/LikeVideo";
import DislikeVideoButton from './DislikeVideo';
import AddComment from './AddComment';
import VideoContainer from './ui/VideoContainer';
import { Separator } from "@/components/ui/separator";
import Chart from "chart.js/auto";
import useFollowUser from '../hooks/FollowUser';
import { Button } from '@/components/ui/button'

function LineChart({ viewsData }) {
  useEffect(() => {
    let chartInstance = null;

    if (viewsData && viewsData.length > 0) {
      const labels = viewsData.map(data => data.date);
      const counts = viewsData.map(data => parseInt(data.count));

      const ctx = document.getElementById('lineChart').getContext('2d');

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Views',
            data: counts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [viewsData]);

  return (
    <div>
      <canvas id="lineChart" width="500" height="300"></canvas>
    </div>
  );
}

function Clip() {
  const { videoID } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
        const data = await response.json();
        let username = data.username
        setUsername(username.toLowerCase())
        setVideoData(data);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
    
  }, [videoID]);

  const { isFollowing, followUser, unfollowUser } = useFollowUser({ username });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  const fetchUpdatedVideoData = async () => {
    try {
      const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
      const data = await response.json();
      setVideoData(data);
    } catch (error) {
      console.error('Error fetching updated video data:', error);
    }
  };

  return (
    <div>
      {videoData && (
        <VideoContainer>
          <div className="flex">
            <div style={{ marginRight: '20px' }}>
              <div className="relative">
                <video className='mt-32' controls>
                  <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`}></source>
                </video>
              </div>
              <div className="mt-4">
                <h2 className="text-3xl font-semibold">{videoData.title}</h2>
                <p className="text-sm text-gray-500">Uploaded by <a className='hover:underline' href={`/user/channel/${videoData.username.toLowerCase()}`}>{videoData.username} | {videoData.follower_count} followers</a></p>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-gray-500">{videoData.total_views} views</p>
                  <span className="mx-2">•</span>
                  <p className="text-sm text-gray-500">Uploaded on: {videoData.uploaded_date}</p>
                </div>
                <div className="flex items-center mt-4">
                  <LikeVideoButton videoID={videoID} onLike={fetchUpdatedVideoData} />
                  <p className="text-sm text-gray-500 ml-2 mr-4">{videoData.likes}</p>
                  <DislikeVideoButton videoID={videoID} onDislike={fetchUpdatedVideoData} />
                  <p className="text-sm text-gray-500 ml-2 mr-4">{videoData.dislikes}</p>
                  <Button onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
                <Separator className="mt-4" />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Comments - {videoData.commentsLen}</h3>
                  <AddComment videoID={videoID} onCommentPosted={fetchUpdatedVideoData} />
                  <ul>
                    {videoData.comments && videoData.comments.map((comment, index) => (
                      <li key={index} className="mb-2">
                        <div className="flex items-start">
                          <img
                            className="rounded-full h-8 w-8 bg-gray-300 mr-2"
                            src={`https://ui-avatars.com/api/?uppercase=true&name=${comment.username}`}
                            alt="User Avatar"
                          />
                          <div>
                            <p className="text-xl">{comment.username} - <span className='text-muted-foreground text-sm'>{comment.date}</span></p>
                            <p className="text-sm text-muted-foreground">{comment.comment}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-32 line-chart-container">
              <LineChart viewsData={videoData.views_data} />
            </div>
          </div>
        </VideoContainer>
      )}
    </div>
  );
}

export default Clip;
