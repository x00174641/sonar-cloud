import React from 'react';
import { useParams } from 'react-router-dom';
import LikeVideoTarget from "../components/LikeVideo";
import DislikeVideoButton from './DislikeVideo';
function Clip() {
  let { videoID } = useParams();

  return (
    <div>
      <p>Video ID: {videoID}</p>
      <video controls>
        <source src={`https://cliprbucket.s3.amazonaws.com/videos/${videoID}`}></source>
      </video>
      <LikeVideoTarget videoID={videoID}></LikeVideoTarget>
      <DislikeVideoButton videoID={videoID}></DislikeVideoButton>
    </div>
  );
}

export default Clip;
