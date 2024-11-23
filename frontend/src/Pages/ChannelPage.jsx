import React, { useEffect, useState, useMemo, useCallback, useContext } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import SubscribeButton from "../components/SubscribeButton";
import VideoContainer from "../components/VideoContainer";
import { CategoryContext } from "../utils/Context";

// Memoized version of the VideoContainer
const MemoizedVideoContainer = React.memo(VideoContainer);

const ChannelPage = React.memo(() => {
  const { username, category } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  const { categoryFilter, setcategoryFilter } = useContext(CategoryContext);

  // Fetch channel data when category or username changes
  const getChannelData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/users/userChannelProfile/${username}/${category}`
      );
      setChannelData(response.data.data);
    } catch (err) {
      setError("Failed to load channel data.");
    }
  }, [username, category]);

  // Set category filter and fetch data on mount or category change
  useEffect(() => {
    setcategoryFilter(category);
    getChannelData();
  }, [category, getChannelData, setcategoryFilter]);

  // Memoized channel statistics to avoid recalculation unless channelData changes
  const channelStats = useMemo(() => {
    return channelData
      ? {
          subscribers: `${channelData.subscribersCount} subscribers`,
          videos: `${channelData.videosCount} videos`,
        }
      : {};
  }, [channelData]);

  // Memoized channel data to avoid re-fetching unless the categoryFilter changes
  const memoizedChannelData = useMemo(() => channelData, [channelData]);

  if (error) {
    return <div>{error}</div>;
  }

  const {
    coverImage,
    avatar,
    fullname,
    username: channelUsername,
    isSubscribed,
    _id: channelId,
    videos,
  } = memoizedChannelData || {};

  return (
    <div className="w-full h-screen font-['Roboto']">
      <div className="max-w-screen-xl relative mx-auto h-full">
        {/* Cover Image */}
        <div className="w-full h-[22vh] rounded-2xl overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={coverImage || "/default-cover.jpg"}
            alt={`${fullname || "Channel"} cover`}
            loading="lazy"
          />
        </div>

        {/* Channel Info */}
        <div className="w-full h-[26vh] flex gap-5 items-center">
          <div className="w-[17vh] h-[17vh] overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover"
              src={avatar || "/default-avatar.jpg"}
              alt={`${fullname || "Channel"} avatar`}
              loading="lazy"
            />
          </div>

          {/* Channel Details */}
          <div className="h-full flex flex-col justify-center gap-2">
            <h1 className="text-[1.8vw] font-[700] leading-none">
              {fullname || "Channel Name"}
            </h1>

            <div className="flex gap-4 text-sm text-zinc-400 font-[500]">
              <p>{channelUsername}</p>
              <p>{channelStats.subscribers}</p>
              <p>{channelStats.videos}</p>
            </div>

            <p className="text-sm text-zinc-400 font-[500]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Deserunt, magni.
            </p>

            <SubscribeButton isSubscribed={isSubscribed} channelId={channelId} />
          </div>
        </div>

        <div className="h-fit w-full bg-primary flex flex-col gap-2 -mt-5">
          <div className="sticky top-0 font-[600] bg-primary z-[2] h-[5vh] pb-1 w-full border-b-[1px] border-[#272727] flex gap-8 text-[#d2d2d2] items-end">
            {["Home", "Videos", "Shorts", "Live", "Playlists", "Community"].map((tab, idx) => (
              <h3 key={idx} className="hover:border-b-[2px] pb-1 border-[#d2d2d2]">{tab}</h3>
            ))}
          </div>

          {/* Navigation for videos */}
          <div className="h-[5vh] w-full flex gap-4 items-center">
            {["latest", "popular", "oldest"].map((tab, idx) => (
              <NavLink
                key={idx}
                to={`/s/${channelUsername}/${tab}`}
                className={({ isActive }) =>
                  `text-white text-sm capitalize py-2 px-[12px] rounded-md font-[400] ${isActive ? "bg-white text-zinc-600" : "bg-[#3E3E3E]"}`
                }
              >
                {tab}
              </NavLink>
            ))}
          </div>

          {/* Videos (memoized video container) */}
          <div className="w-full flex flex-wrap h-fit">
            {videos && videos.map((video) => (
              <MemoizedVideoContainer key={video._id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChannelPage;
