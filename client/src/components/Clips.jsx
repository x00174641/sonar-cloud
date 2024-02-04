import React from 'react';
import { useParams } from 'react-router-dom';

function Clip() {
  let { videoID } = useParams();

  return (
    <div>
      <p>Video ID: {videoID}</p>
      <video controls>
        <source src={`https://cliprbucket.s3.amazonaws.com/videos/videos/${videoID}`}></source>
      </video>
    </div>
  );
}

export default Clip;
