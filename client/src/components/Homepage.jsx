import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import useFetchStatistics from '../hooks/FetchHomePageStats.jsx';
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { FaWindows } from "react-icons/fa6";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import Container2 from './ui/Container2.jsx';
import OBS from '../assets/obs.jpg'
import Untitled from '../assets/Untitled.mp4'

function HomePage() {
    const { data } = useFetchStatistics();
    const cardData = [
        { title: 'CLIPS UPLOADED', content: data.totalVideosClipped },
        { title: 'ACCOUNTS REGISTERED', content: "3+" },
        { title: 'CLIPS TODAY', content: "0" },
    ];
    const backgroundVideoStyle = {
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
        opacity: 0.07,
    };
    return (
        <div>
            <section id='home' style={{ position: 'relative', height: '100vh' }}> {/* Set position to 'relative' and height to '100vh' */}
                <Container2>
                    <video
                        style={backgroundVideoStyle}
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={Untitled} type="video/mp4" />
                    </video>

                    <TypeAnimation
                        
                        className='font-bold tracking-tighter bg-clip-text type-animation'
                        sequence={[
                            `CLIPR Technology`,
                            3000,
                            'Empowering Digital Transformation',
                            4000,
                            'Driving Progress with Cutting-Edge Technology',
                            3000,
                        ]}
                        speed={150}
                        repeat={Infinity}
                    />
                    <small className='text-muted-foreground text-lg'>Cliprs is a user-friendly tool for recording and trimming content, enabling users to capture and share highlights effortlessly via generated links.</small>
                    <br></br>
                    <Button style={{ fontSize: "28px" }} size="xl">Download For Windows &#8201; <FaWindows /></Button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '120px' }}>
                        {cardData.map((item, index) => (
                            <Card key={index} style={{ width: '30%', textAlign: 'center' }}>
                                <CardContent>
                                    <div style={{ fontSize: '64px', fontWeight: 'bold' }}>{item.content}</div>
                                    <CardTitle className='text-muted-foreground text-lg'>{item.title}</CardTitle>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <a href="#info" className="mt-5 rounded flex justify-center">
                        <MdKeyboardDoubleArrowDown className='arrow  arrow-style' />
                    </a>
                </Container2>
            </section>
            <section className="bg-gradient" id='info'>
                <Container2>
                    <div className="w-full flex justify-center">
                        <h1 style={{ marginTop: '150px', fontSize: "34px", backgroundColor: '#5463ce', width: '50%' }}>An Open Source Project built for you.</h1>
                    </div>
                    <h1 className='font-bold bg-clip-text text-2sm text-gradient-purple-blue'>Utilizing Open Source Technology OBS</h1>
                    <p className='text-muted-foreground mt-4'>OBS Studio is a free and open-source, cross-platform screencasting and streaming app.<br></br>It is available for Windows, macOS, Linux distributions, and BSD. The OBS Project raises funds on the platforms Open Collective and Patreon.</p>
                    <div className="w-full flex justify-center items-center" style={{ marginTop: '150px' }}>
                        <div className="w-full md:w-1/2 ">
                            <h1 className="customFont" style={{ fontSize: "14px", color: '#7286fe' }}>Open Broadcast Software</h1>
                            <p style={{ fontSize: "30px" }}>Cliprs Usage of Open Broadcast Software!</p>
                            <p className="text-muted-foreground" style={{ fontSize: "16px" }}>Clipr Solutions has been utilizing OBS to help on-site users trim content.<br />We use many functionalities provided by OBS such as Recording the user's screen.</p>
                            <a href="https://obsproject.com/"><Button style={{ fontSize: "28px" }} size="xl">Explore Open Broadcast Software</Button></a>

                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img src={OBS} alt="Image" width={"40%"} />
                        </div>
                    </div>
                </Container2>

            </section>
        </div>
    )
}

export default HomePage;
