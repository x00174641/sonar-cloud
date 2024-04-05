import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function useFollowUser() {
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`https://api.clipr.solutions/check_follow_status/${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsFollowing(data.isFollowing);
                } else {
                    setIsFollowing(false); 
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
                setIsFollowing(false);
            }
        };

        checkFollowStatus();
    }, [username]);

    const followUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`https://api.clipr.solutions/follow_user/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setIsFollowing(true);
            } else {
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const unfollowUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`https://api.clipr.solutions/follow_user/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setIsFollowing(false);
            } else {
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return { isFollowing, followUser, unfollowUser };
}

export default useFollowUser;