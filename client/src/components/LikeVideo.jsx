import React, { useState } from 'react';
import { AiOutlineLike } from "react-icons/ai";

const LikeVideoButton = ({ videoID, onLike }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const likeVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions/api/like/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ videoID }), 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.json();
            console.log('Success:', content);

            if (onLike) {
                onLike();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AiOutlineLike size="24" onClick={likeVideo} disabled={loading}> 
        </AiOutlineLike>
    );
};

export default LikeVideoButton;
