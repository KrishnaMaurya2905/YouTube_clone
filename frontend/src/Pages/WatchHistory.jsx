import React, { useEffect , useState } from "react";
import axios from "axios";
import WatchVideoCont from "../components/WatchVideoCont";
const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  useEffect(() => {
    
    const getWatchHistory = async () => {
      try {
        const { data } = await axios.get("/users/userWatchHistory");
        setWatchHistory(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getWatchHistory();
  }, []);
  return <div className="text-white w-full">
  
    <div className="h-fit max-w-screen-lg  ml-[10%] flex flex-col font-['Roboto'] gap-5">
    <h1 className="text-4xl pb-10 font-bold" >Watch History</h1>
    {watchHistory.map((video , idx) => (
     <WatchVideoCont video={video} key={idx} />
    ))}
    </div>
  </div>;
};

export default WatchHistory;
