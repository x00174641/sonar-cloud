import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function AddComment({ videoID }) {
    const [comment, setComment] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://api.clipr.solutions:5000/api/comment/', {
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

            setComment('');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Comment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a Comment</DialogTitle>
                    <DialogDescription>
                        Comment what you think about this video.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Add your comment here."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <DialogFooter>
                        <Button type="submit">Comment</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddComment;
