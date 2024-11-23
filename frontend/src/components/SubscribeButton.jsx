import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsBell } from "react-icons/bs";

const SubscribeButton = ({ isSubscribed: initialSubscribed, channelId }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed); 
  const handleSubscribe = async () => {
    try {
      const response = await axios.post(`/subscription/subscribe/${channelId}`);
      
      if (response.data.success) {
        setIsSubscribed((prev)=>!prev);

      }
    } catch (error) {
      console.error("Subscribe failed:", error);
    }
  };

  useEffect(() => {
    setIsSubscribed(initialSubscribed); // Sync state with initial value if necessary
  }, [initialSubscribed]);

  return (
    <button
      onClick={handleSubscribe} // React's onClick to handle the subscription
      className={`px-5 py-2 w-fit gap-5 rounded-full flex items-center ${isSubscribed ? "bg-[#272727] " :"bg-white text-black" } cursor-pointer`}
    >
      {isSubscribed && <BsBell  /> }
      <h2>{isSubscribed ? "Subscribed" : "Subscribe"}</h2>
    </button>
  );
};


export default SubscribeButton;
