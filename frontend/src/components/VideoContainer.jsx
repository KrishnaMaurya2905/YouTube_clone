import React from "react";
import { formatDistanceToNow } from "date-fns";
import { formatViews , formatDuration} from "../utils/requiredUtils";
// Helper function to format views


// Helper function to format duration like YouTube (e.g., "05:22" or "1:03:45")

const VideoContainer = ({ video }) => {
  const timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });
  const maxTitleLength = 50;
  const truncatedTitle = video.title.length > maxTitleLength
    ? video.title.slice(0, maxTitleLength) + "..."
    : video.title;

  const formattedViews = formatViews(video.views);
  const formattedDuration = formatDuration(video.duration);

  return (
    <div className="h-[30vh] w-1/4 px-2 py-3 flex flex-col">
      <div className="videoBox h-[70%] relative w-full rounded-xl overflow-hidden">
        <img className="h-full w-full object-cover" src={video.thumbnail} alt={video.title} />
        <h3 className="absolute text-xs font-[500] bottom-2 right-2 text-white px-1 py-0.5 rounded">
          {formattedDuration}
        </h3>
      </div>
      <div className="videoInfo h-fit w-full flex flex-col text-sm px-2 py-2">
        <h1>{truncatedTitle}</h1>
        <div className="flex gap-4 text-xs text-zinc-400 font-[500]">
          <h2>{formattedViews} views</h2> {/* Display formatted views */}
          <h2>{timeAgo}</h2>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
