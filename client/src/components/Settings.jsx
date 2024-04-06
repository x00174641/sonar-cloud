import React, { useState, useEffect } from 'react';
import VideoContainer from "./ui/VideoContainer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label"
import CameraFeed from '@/components/ObsConnect';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
function UserSettings() {
    const [obsPort, setObsPort] = useState('');
    const [clipInterval, setClipInterval] = useState('');
    const [clipHotkey, setClipHotkey] = useState('');
    const [softwarePassword, setsoftwarePassword] = useState('');

    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('https://api.clipr.solutions/user/settings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }

                const settings = await response.json();
                setObsPort(settings.obs_port || '');
                setClipInterval(settings.clip_interval || '');
                setClipHotkey(settings.clip_hotkey || '');
                setsoftwarePassword(settings.password || '');
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch software settings",
                    description: error.toString(),
                    status: "error",
                });
            }
        };

        fetchSettings();
    }, []);

    const handleSoftwareSettingsSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://api.clipr.solutions/update/clipr/software/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: localStorage.getItem('accessToken'),
                    obs_port: obsPort,
                    clip_interval: clipInterval,
                    clip_hotkey: clipHotkey,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            toast({
                title: "Software settings updated successfully!",
                status: "success",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to update software settings",
                description: error.toString(),
                status: "error",
            });
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-10">
            <div className="w-full max-w-screen-2xl">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-[200px] rounded-lg border"
                >
                    <ResizablePanel defaultSize={75}>
                        <div className="flex h-full items-center justify-center p-4">
                            <CameraFeed password={softwarePassword} port={obsPort} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={25}>
                        <form onSubmit={handleSoftwareSettingsSubmit} className="w-[1850px] mx-auto flex">
                            <div className="flex">
                                <Card className="border mt-20 mb-10 flex-1">
                                    <CardHeader>
                                        <CardTitle>CLIPR Software Configuration</CardTitle>
                                        <CardDescription>
                                            <Label className="text-right">OBS Port: (Default: 4455)</Label>
                                            <Input className="mb-3 mt-2" type="number" placeholder="OBS Port" value={obsPort} onChange={e => setObsPort(e.target.value)} />
                                            <Label className="text-right">Clip Trim Interval:</Label>
                                            <Input className="mb-3 mt-2" type="number" placeholder="Trim Interval in Seconds" value={clipInterval} onChange={e => setClipInterval(e.target.value)} />
                                            <Label className="text-right">Clip Hotkey:</Label>
                                            <Input className="mb-3 mt-2" type="text" placeholder="Clip Hotkey" value={clipHotkey} onChange={e => setClipHotkey(e.target.value)} />
                                            <Button type="submit">Save Software Settings</Button>
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        </form>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>


    )
}
// )
//     <VideoContainer className="flex justify-center items-center">
//         <div className="mt-20 mb-10 ml-6 flex-1"> {/* Added flex-1 to make the CameraFeed take available space */}
//             <CameraFeed />
//         </div>
//         <form onSubmit={handleSoftwareSettingsSubmit} className="w-[1850px] mx-auto flex">
//             <div className="flex">
//                 <Card className="border mt-20 mb-10 flex-1"> {/* Added flex-1 to make the card take available space */}
//                     <CardHeader>
//                         <CardTitle>CLIPR Software Configuration</CardTitle>
//                         <CardDescription>
//                             <Label className="text-right">OBS Port: (Default: 4443)</Label>
//                             <Input className="mb-3 mt-2" type="number" placeholder="OBS Port" value={obsPort} onChange={e => setObsPort(e.target.value)} />
//                             <Label className="text-right">Clip Trim Interval:</Label>
//                             <Input className="mb-3 mt-2" type="number" placeholder="Trim Interval in Seconds" value={clipInterval} onChange={e => setClipInterval(e.target.value)} />
//                             <Label className="text-right">Clip Hotkey:</Label>
//                             <Input className="mb-3 mt-2" type="text" placeholder="Clip Hotkey" value={clipHotkey} onChange={e => setClipHotkey(e.target.value)} />
//                             <Button type="submit">Save Software Settings</Button>
//                         </CardDescription>
//                     </CardHeader>
//                 </Card>
//             </div>
//         </form>
//     </VideoContainer>


// );
// }

export default UserSettings;
