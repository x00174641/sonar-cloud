import React, { useState } from 'react';
import { SlDislike } from "react-icons/sl";

const DislikeVideoButton = ({ videoID }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dislikeVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://127.0.0.1:5000/api/dislike/', { 
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
        } catch (error) {
            console.error('An error occurred:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SlDislike onClick={dislikeVideo} disabled={loading} /> 
    );
};

export default DislikeVideoButton;