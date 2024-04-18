import React from 'react';
import Container2 from './ui/Container2';
import { Button } from '@/components/ui/button';

function NotFound() {
    return (

        <div>
            <Container2>
            <h1 className="not-found-text mt-20">404 Not</h1>
            <p className='text-xl'>Looks like you're lost.</p>
            <p>The page you are looking for could not be found.</p>
            <a href="/"><Button variant="outline" className="mt-10">RETURN HOME</Button></a>

            </Container2>
        </div>
    );
}

export default NotFound;
