import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const VideoPlayer = () => {
  const [videoData, setVideoData] = useState(""); // Initialize as empty string for URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/videos/66ec1350056f6950869e3212");
        console.log(data.data.videoFile); // Check if the URL is correct
        setVideoData(data.data.videoFile); // Set the video URL
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="player-wrapper">
      {videoData && (
        <ReactPlayer
          className="react-player"
          url={videoData} 
          width="100%"
          height="100%"
          controls={true} 
        />
      )}
    </div>
  );
};

export default VideoPlayer;
