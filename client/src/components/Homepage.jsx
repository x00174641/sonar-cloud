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
import { Input } from "@/components/ui/input"
import Software from "../assets/CliprSoftware.zip"
function HomePage() {
    const { data } = useFetchStatistics();
    const cardData = [
        { title: 'Clips Uploaded', content: data.totalVideosClipped },
        { title: 'Accounts Registered', content: data.total_users, },
        { title: 'Total Views', content: data.total_views, },
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
                            'Leading the Future of Technology',
                            3000,
                        ]}
                        speed={150}
                        repeat={Infinity}
                    />

                    <small className='text-muted-foreground text-lg'>Clipr is a user-friendly tool for recording and trimming content, enabling users to capture and share highlights effortlessly via generated as.</small>
                    <br></br>
                    <a href={Software} download="CliprSoftware.zip"><Button style={{ fontSize: "28px" }} size="xl">Download For Windows &#8201; <FaWindows /></Button></a>

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
        <section className="bg-gradient-2 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center items-start gap-4">
                <RocketIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Real Life Solutions</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Make editing easier than ever with Cliprs Trimming Software by trimming your specified moments.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center items-start gap-4">
                <GaugeIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Extreme Quality Software</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                 Record & Trim recordings with ease with your optimized PC specs using Open Broadcast Software.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <BoldIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Personalization</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Continuously allowing you to elevate on customizations on cutting edge software.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gradient-3 w-full py-12 md:py-24 lg:py-32" id='contact'>
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Updates</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Stay up to date with cliprs technology.
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out cliprs socials to receive updates on the latest developments.
                </p>
              </div>
             
              <div className="flex justify-center gap-4">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                  <TwitterIcon className="h-10 w-10" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="https://github.com/x00174641">
                  <GithubIcon className="h-10 w-10" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="https://www.linkedin.com/in/fungjason1/">
                  <LinkedinIcon className="h-10 w-10" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
            </section>
        </div>
    )
}
function BoldIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 12a4 4 0 0 0 0-8H6v8" />
        <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
      </svg>
    )
  }
  
  
  function GaugeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 14 4-4" />
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      </svg>
    )
  }
  
  
  function GithubIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    )
  }
  
  
  function LinkedinIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  }
  
  
  function RocketIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    )
  }
  
  
  function TwitterIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    )
  }
export default HomePage;
