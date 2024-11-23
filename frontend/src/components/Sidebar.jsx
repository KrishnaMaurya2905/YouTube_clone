import React, { useEffect, useState, useContext, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { BiSolidHome } from "react-icons/bi";
import { MdSubscriptions, MdWatchLater } from "react-icons/md";
import { VscHistory } from "react-icons/vsc";
import { SiYoutubeshorts } from "react-icons/si";
import { BiLike, BiSolidUserAccount } from "react-icons/bi";
import { CiYoutube } from "react-icons/ci";
import { CgPlayList } from "react-icons/cg";
import axios from "axios";
import { CategoryContext } from "../utils/Context";

// Static NavLink Data
const NavlinkData = [
  { text: "Home", path: "/", icon: <BiSolidHome /> },
  { text: "Shorts", path: "/shorts", icon: <SiYoutubeshorts /> },
  { text: "Subscription", path: "/feed/subscription", icon: <MdSubscriptions /> },
  { text: "Your Channel", path: "/yourchannel", icon: <BiSolidUserAccount /> },
  { text: "History", path: "/history", icon: <VscHistory /> },
  { text: "Playlists", path: "/playlists", icon: <CgPlayList /> },
  { text: "Your Videos", path: "/yourvideos", icon: <CiYoutube /> },
  { text: "Watch Later", path: "/watchlater", icon: <MdWatchLater /> },
  { text: "Liked Videos", path: `/user/liked`, icon: <BiLike /> },
];

const Sidebar = React.memo(() => {
  const { categoryFilter } = useContext(CategoryContext); 
  const [subscriptionData, setSubscriptionData] = useState([]);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      const response = await axios.get("/subscription/getAllSubscriptions");
      setSubscriptionData(response.data.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const renderNavLinks = () => {
    return NavlinkData.map((item, index) => (
      <React.Fragment key={index}>
        <NavLink to={item.path} className={({ isActive }) => (isActive ? 'bg-secondary rounded-xl' : "")}>
          <div className="flex items-center py-2 px-3">
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </div>
        </NavLink>
        {(index === 2 || index === 8) && <hr className="my-4 opacity-30" />}
      </React.Fragment>
    ));
  };

  const renderSubscriptions = () => {
    if (subscriptionData.length > 0) {
      return subscriptionData.map((item, index) => (
        <React.Fragment key={index}>
          <NavLink
            to={`/s/${item.username}/${categoryFilter}`}
            className={({ isActive }) => (isActive ? 'bg-secondary rounded-xl' : "")}
          >
            <div className="flex items-center py-2 px-3">
              <img src={item.avatar} alt={item.fullname} className="w-8 h-8 rounded-full" />
              <span className="ml-2">{item.fullname}</span>
            </div>
          </NavLink>
        </React.Fragment>
      ));
    } else {
      return <p className="text-gray-500 px-4">No subscriptions found.</p>;
    }
  };

  return (
    <div className="w-[15%] flex flex-col font-['poppins'] py-5 px-5 gap-[1px] bg-primary">
      {renderNavLinks()}
      <h3 className="text-xl px-4 pb-2 font-[500]">Subscriptions</h3>
      {renderSubscriptions()}
    </div>
  );
});

export default Sidebar;
