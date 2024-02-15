import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button'
import Container from './ui/Container';

function HomePage() {

    const backgroundVideoStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
        opacity: 0.4,
    };

    return (
        <div>
        <Container>
            <video
                style={backgroundVideoStyle}
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="https://cliprbucket.s3.amazonaws.com/videos/Untitled.mp4" type="video/mp4" />
            </video>

            <TypeAnimation
                style={{ fontSize: '4em', whiteSpace: 'pre-line', display: 'block', marginTop: '250px' }}
                className='font-bold tracking-tighter bg-clip-text '
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
            <Button variant="opacity" size="lg">Download Software</Button>
            <div class="wave">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill" opacity="0.9"></path>
                </svg>
            </div>
        </Container>
        </div>
    )
}

export default HomePage