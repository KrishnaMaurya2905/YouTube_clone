import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import { IoMdMenu } from "react-icons/io";
import { Routes, Route, useLocation } from "react-router-dom";
import HomeFeed from "./HomeFeed.jsx"; // Ensure the path is correct
import Subscription from "./Subscription.jsx"; // Ensure the path is correct
import WatchHistory from "./WatchHistory.jsx";
import Shorts from "./Shorts.jsx";
import YourChannel from "./YourChannel.jsx";
import YourVideos from "./YourVideos.jsx";
import Playlists from "./Playlists.jsx";
import WatchLater from "./WatchLater.jsx";
import LikedVideos from "./LikedVideos.jsx";
import ChannelPage from "./ChannelPage.jsx";

const Home = () => {
  const location = useLocation(); // Get the current location

  return (
    <div className="h-full w-full text-white">
      <div className="h-[8%] w-full bg-primary flex items-center px-[1%] justify-between">
        <div className="flex items-center gap-5">
          <IoMdMenu className="text-3xl" />
          <img
            className="h-10"
            src="https://t3.ftcdn.net/jpg/05/07/46/84/360_F_507468479_HfrpT7CIoYTBZSGRQi7RcWgo98wo3vb7.jpg"
            alt="Logo"
          />
        </div>
      </div>

      <div className="h-[92%] flex w-full bg-primary">
        <Sidebar />
        <div className="w-[85%] h-full ">
          {location.pathname === "/" && (
            <div className="h-[8%] bg-yellow-300 w-full"></div>
          )}
          <div className="h-full overflow-y-auto">
            <div className="min-h-screen w-full items-start flex flex-col gap-10 ">
              <Routes>
                <Route path="/" element={<HomeFeed />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/feed/subscription" element={<Subscription />} />
                <Route path="/yourchannel" element={<YourChannel />} />
                <Route path="/history" element={<WatchHistory />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/yourVideos" element={<YourVideos />} />
                <Route path="/user/liked" element={<LikedVideos />} />
                <Route path="/watchLater" element={<WatchLater />} />
                <Route path="/s/:username/:category" element={<ChannelPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
