import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import useFetchStatistics from '../hooks/FetchHomePageStats.jsx';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Sparklines, SparklinesLine, SparklinesSpots} from 'react-sparklines';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const { data, isLoading2, error2 } = useFetchStatistics();
    const navigate = useNavigate();
    const cardData = [
        { title: 'Clips Uploaded', content: data.totalVideosClipped },
        { title: 'Accounts Registered', content: '2' },
        { title: 'Todays Clips', content: data.totalClips_Today },
    ];
    const [videoIDs, setVideoIDs] = useState([]);
    const [randomVideos, setRandomVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [videos, setVideos] = useState({});
    
useEffect(() => {
    const checkAdminStatus = async () => {
        try {
            const response = await fetch('http://139.59.160.51:5000/isAdmin', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.accessToken}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                if (!result.isAdmin) {
                    navigate('/');
                }
            } else {
                navigate('/');
                throw new Error('Failed to fetch admin status');
            }
        } catch (error) {
            console.error(error);
        }
    };

    checkAdminStatus();
}, [navigate]);

    useEffect(() => {
        const fetchVideoIDs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://139.59.160.51:5000/api/getVideos');
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
                    const response = await fetch(`http://139.59.160.51:5000/videos/${videoID}`);
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

    return (
        <div>
            <h1 className="text-3xl m-8" style={{ textAlign: 'center' }}>Statistics</h1>
            {isLoading2 ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : error2 ? (
                <p style={{ textAlign: 'center' }}>Error: {error}</p>
            ) : (
                <div className="flex justify-center" style={{ marginBottom: '50px', textAlign: 'center' }}>
                    {cardData.map((card, index) => (
                        <div key={index} className="flex-1" style={{ minWidth: '300px', maxWidth: '300px', margin: '0 10px' }}>
                            <Card className='border px-3 py-3'>
                                <CardTitle>{card.title}</CardTitle>
                                <CardContent>
                                    <p>{card.content}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
            <Table className="mx-auto" style={{ minWidth: '300px', maxWidth: '800px' }}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-2">User</TableHead>
                        <TableHead className="px-4 py-2">Video ID</TableHead>
                        <TableHead className="px-4 py-2">Title</TableHead>
                        <TableHead className="px-4 py-2">Total Views</TableHead>
                        <TableHead className="px-4 py-2">Uploaded Date</TableHead>
                        <TableHead className="px-4 py-2">Performance</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videoIDs.map((videoID, index) => (
                        <TableRow key={index}>
                            <TableCell className="px-4 py-2">{videos[videoID]?.username}</TableCell>
                            <TableCell className="px-4 py-2"><a href={`http://localhost:5173/clip/${videos[videoID]?.videoID}`}>{videos[videoID]?.videoID}</a></TableCell>
                            <TableCell className="px-4 py-2 truncate">{videos[videoID]?.title}</TableCell>
                            <TableCell className="px-4 py-2">{videos[videoID]?.total_views}</TableCell>
                            <TableCell className="px-4 py-2">{videos[videoID]?.uploaded_date}</TableCell>
                            <TableCell className="px-4 py-2">
                                {videos[videoID]?.views_data && (
                                    <Sparklines data={videos[videoID].views_data.map(item => parseInt(item.count))} width={100} height={20}>
                                        <SparklinesLine className='sparkline-colour' />
                                        <SparklinesSpots />
                                    </Sparklines>
                                )}
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Admin;
