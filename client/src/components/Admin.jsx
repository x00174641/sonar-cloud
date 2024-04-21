import useFetchStatistics from '../hooks/FetchHomePageStats.jsx';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast";
import EditVideo from "@/components/EditVideo";

export default function Admin() {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch('https://api.clipr.solutions/isAdmin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.accessToken}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (!result.isAdmin) {
                        navigate('4/');
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

    const { data } = useFetchStatistics();
    const [userData, setUserData] = useState([]);
    const [videoIDs, setVideoIDs] = useState([]);
    const [randomVideos, setRandomVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videos, setVideos] = useState({});
    const [sortType, setSortType] = useState(null);
    useEffect(() => {
        if (data.users) {
            setUserData(data.users);
        }
    }, [data.users]);
    const cardData = [
        { title: 'Clips Uploaded', content: data.totalVideosClipped, description: 'Total clips uploaded to date.' },
        { title: 'Accounts Registered', content: data.total_users, description: 'Total accounts registered on Clipr.' },
        { title: 'Todays Clips', content: data.totalClips_Today, description: 'Clips uploaded today.' },
        { title: 'Total Views', content: data.total_views, description: 'Views on the Platform' },

    ];
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

    useEffect(() => {
        fetchVideoIDs();
    }, []);

    const deleteUser = async (username) => {
        try {
            const response = await fetch('https://api.clipr.solutions/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.accessToken}`
                },
                body: JSON.stringify({ username })
            });
            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Success, deleted user!",
                    description: result.message,
                    status: "error",
                });
                setUserData(userData.filter(user => user.Username !== username));
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to delete user",
                    status: "error",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const deleteVideo = async (videoID) => {
        try {
            const response = await fetch(`https://api.clipr.solutions/delete/videos/?videoID=${videoID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            if (response.status === 200) {
                toast({
                    title: `Successful, deleted ${videoID}!`,
                    status: "success",
                });
                fetchVideoIDs();
            } else {
                toast({
                    variant: "destructive",
                    title: "Something went wrong...",
                    description: result.error,
                    status: "error",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong...",
                description: error.message,
                status: "error",
            });
        }
    };

    const recommendVideo = async (videoID, videoInfo) => {
        try {
          const response = await fetch(`https://api.clipr.solutions/update_video`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoID, isRecommended: true, ...videoInfo })
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const result = await response.json();
          if (response.status === 200) {
            toast({
              title: `Successful, recommended ${videoID}!`,
              status: "success",
            });
            fetchVideoIDs();
          } else {
            toast({
              variant: "destructive",
              title: "Something went wrong...",
              description: result.error,
              status: "error",
            });
          }
        } catch (error) {
          console.error('Error recommending video:', error);
        }
      };

    const unrecommendVideo = async (videoID, videoInfo ) => {
        try {
            const response = await fetch(`https://api.clipr.solutions/update_video`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ videoID, isRecommended: false,...videoInfo })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            if (response.status === 200) {
                toast({
                    title: `Successful, unrecommended ${videoID}!`,
                    status: "success",
                });
                fetchVideoIDs();
            } else {
                toast({
                    variant: "destructive",
                    title: "Something went wrong...",
                    description: result.error,
                    status: "error",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong...",
                description: error.message,
                status: "error",
            });
        }
    };

    const sortVideosByViews = () => {
        const sortedVideos = videoIDs.sort((a, b) => {
            const viewsA = videos[a]?.total_views || 0;
            const viewsB = videos[b]?.total_views || 0;
            return sortType === "views" ? viewsA - viewsB : viewsB - viewsA;
        });
        setVideoIDs([...sortedVideos]);
        setSortType(sortType === "views" ? null : "views");
    };
    
    const sortVideosByRecommendation = () => {
        const sortedVideos = videoIDs.sort((a, b) => {
            const recommendedA = videos[a]?.isRecommended || false;
            const recommendedB = videos[b]?.isRecommended || false;
            return sortType === "recommendation" ? recommendedA - recommendedB : recommendedB - recommendedA;
        });
        setVideoIDs([...sortedVideos]);
        setSortType(sortType === "recommendation" ? null : "recommendation");
    };

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[80px] items-center border-b px-6">
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            <a
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="#"
                            >
                                <HomeIcon className="h-4 w-4" />
                                Home
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[80px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <a className="lg:hidden" href="#">
                        <Package2Icon className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </a>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="flex items-center">
                        <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cardData.map((card, index) => (
                            <Card key={index}>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                                <CardContent>
                                    <div className="text-4xl font-bold">{card.content}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="border shadow-sm rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username (PK)</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Creation Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userData.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{user.Username}</TableCell>
                                        <TableCell>{user.Email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.IsConfirmed ? "default" : "outline"}>{user.IsConfirmed ? "CONFIRMED" : "UNCONFIRMED"}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.CreationDate}
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="ghost" onClick={() => deleteUser(user.Username)}>
                                                <Trash2Icon className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="border shadow-sm rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Video Owner</TableHead>
                                    <TableHead>Video URL</TableHead>
                                    <TableHead>Video Title</TableHead>
                                    <TableHead>Creation Date</TableHead>
                                    <TableHead>Total Views <Button variant="ghost" onClick={sortVideosByViews}>{sortType === "views" ? "▼" : "▲"}</Button></TableHead>
                                    <TableHead>Performance</TableHead>
                                    <TableHead>Actions</TableHead>
                                    <TableHead>Recommended <Button variant="ghost" onClick={sortVideosByRecommendation}>{sortType === "recommendation" ? "▼" : "▲"}</Button></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {videoIDs.map((videoID, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{videos[videoID]?.username}</TableCell>
                                        <TableCell className="font-medium line-clamp-1"><a href={`http://localhost:5173/clip/${videos[videoID]?.videoID}`}>{videos[videoID]?.videoID.slice(0, 10)}...</a></TableCell>
                                        <TableCell className="font-medium truncate">{videos[videoID]?.title}</TableCell>
                                        <TableCell className="font-medium">{videos[videoID]?.uploaded_date}</TableCell>
                                        <TableCell className="font-medium">{videos[videoID]?.total_views}</TableCell>
                                        <TableCell className="font-medium">
                                            {videos[videoID]?.views_data && (
                                                <Sparklines data={videos[videoID].views_data.map(item => parseInt(item.count))} width={100} height={20}>
                                                    <SparklinesLine className='sparkline-colour' />
                                                    <SparklinesSpots />
                                                </Sparklines>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost">
                                                <EditVideo videoID={videos[videoID]?.videoID} refreshData={fetchVideoIDs} />
                                            </Button>

                                            <Button size="sm" variant="ghost" onClick={() => deleteVideo(videos[videoID]?.videoID)}>
                                                <Trash2Icon className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {videos[videoID]?.isRecommended ? (
                                                <Button variant="ghost" onClick={() => unrecommendVideo(videos[videoID]?.videoID, { title: videos[videoID]?.title, description: videos[videoID]?.description, tags: videos[videoID]?.tags })}>
                                                    Unrecommend
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" onClick={() => recommendVideo(videos[videoID]?.videoID, { title: videos[videoID]?.title, description: videos[videoID]?.description, tags: videos[videoID]?.tags })}>
                                                    Recommend
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
    )
}

function HomeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}


function Package2Icon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    )
}

function Trash2Icon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    )
}
