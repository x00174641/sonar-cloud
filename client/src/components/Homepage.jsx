import { TypeAnimation } from 'react-type-animation';
import {
    Card,
    CardContent,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

function HomePage() {
    const cardData = [
        { title: 'Clips Uploaded', content: '6' },
        { title: 'Accounts Registered', content: '2' },
        { title: 'Todays Clips', content: '0' },
      ];
    return (
        <div>
        <TypeAnimation
            sequence={[
                'CLIPR Technology',
                1000,
                'Innovating the Future of Tech',
                1000,
                'Empowering Digital Transformation',
                1000,
                'Crafting Smart Solutions for Everyday Challenges',
                1000,
                'Driving Progress with Cutting-Edge Technology',
                1000
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block', marginBottom: '50px'}}
            repeat={Infinity}
        />
        <div className="flex justify-center" style={{ marginBottom: '50px' }}>
        {cardData.map((card, index) => (
            <div key={index} className="flex-1" style={{ minWidth: '300px', maxWidth: '300px', margin: '0 10px' }}>
            <Card>
                <CardTitle>{card.title}</CardTitle>
                <CardContent>
                <p>{card.content}</p>
                </CardContent>
            </Card>
            </div>
        ))}
        </div>
            <h3>About CLIPR.</h3>
            <p className="!mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            <Button>Download Software</Button>
            </div>
    )
}

export default HomePage