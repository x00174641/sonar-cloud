import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

function useFollowUser(props) {
    const { username } = props;
    const [isFollowing, setIsFollowing] = useState(false);
    const { toast } = useToast();
    
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
                toast({
                    title: `Success, you're following ${username}!`,
                    status: "success",
                });
            } else {
                toast({
                    title: `Error: You cannot follow this user.`,
                    status: "error",
                });
            }
        } catch (error) {
            console.error('Error following user:', error);
            toast({
                title: `Error, following ${username}!`,
                status: "error",
            });
        }
    };

    const unfollowUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`https://api.clipr.solutions/follow_user/${username}`, {
                method: 'POST', // Change method to DELETE for unfollow
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setIsFollowing(false);
                toast({
                    title: `Success, unfollowed ${username}!`,
                    status: "success",
                });
            } else {
                toast({
                    title: `Error`,
                    status: "error",
                });
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            toast({
                title: `Error: ${error}`,
                status: "error",
            });
        }
    };

    return { isFollowing, followUser, unfollowUser };
}

export default useFollowUser;
