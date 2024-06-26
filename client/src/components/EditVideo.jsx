import React, { useState, useEffect } from 'react';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import VideoDeleteButton from "@/components/Delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "react-tag-input-component";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

function EditVideo({ videoID, refreshData }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [publicVideo, setPublicVideo] = useState([]);

    const { toast } = useToast();


    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title);
                    setDescription(data.description);
                    setTags(data.tags || []);
                    setPublicVideo(data.publicVideo)
                    console.log(data.publicVideo)
                } else {
                    console.error('Failed to fetch video details');
                }
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [videoID]);

    const saveChanges = async () => {
        try {
            const response = await fetch(`https://api.clipr.solutions/update_video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    videoID,
                    title,
                    description,
                    tags,
                    publicVideo
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update video');
            }
            refreshData();
            toast({
                title: "Video updated successfully!",
                status: "success",
            });
        } catch (error) {
            toast({
                title: "Error updating video",
                description: error.toString(),
                status: "error",
            });
        }
    };
    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <HiOutlinePencilAlt size={18} />
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Edit your video</SheetTitle>
                        <SheetDescription>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2 mb-3">
                                    <Input
                                        placeholder="TITLE"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        maxlength="60"
                                    />
                                </div>
                            </div>
                            <Textarea
                                placeholder="Video Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mb-3"
                                maxlength="1500"
                            />
                            <TagsInput
                                value={tags}
                                onChange={setTags}
                                name="Tags"
                                placeHolder="Enter Tags"
                            />
                            <div className="flex items-center space-x-2 mt-4">
                            <Label htmlFor="Public Video">Public Video</Label>
                            <Switch
                                checked={publicVideo}
                                onCheckedChange={setPublicVideo}
                            />
                            </div>
                
                            <div className="flex items-center space-x-2 mt-5">
                                <div className="grid flex-1 gap-2">
                                    <VideoDeleteButton videoID={videoID} refreshData={refreshData} />
                                </div>
                                <SheetClose>
                                <div className="grid flex-1 gap-2">
                                    <Button onClick={saveChanges}>Save Changes</Button>
                                </div>
                                </SheetClose>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default EditVideo;
