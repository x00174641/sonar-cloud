import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
function AddComment({ videoID, onCommentPosted }) {
    const [comment, setComment] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions/api/comment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ videoID, comment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (typeof onCommentPosted === 'function') {
                onCommentPosted();
            }

            toast({
                title: `Your comment has been added!`,
                status: "success",
            });

            setComment('');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    };

    return (
        <div>
            <Textarea
                className="mb-2"
                placeholder="Add your comment here."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <DialogFooter>
            <Button className="comment-button" onClick={handleSubmit}>Comment</Button>
            </DialogFooter>
        </div>
    );
}

export default AddComment;
