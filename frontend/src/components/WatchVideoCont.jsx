import React from 'react'
import { CgMoreVerticalAlt } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { formatViews , formatDuration} from "../utils/requiredUtils";

const WatchVideoCont = ({ video }) => {
  return (
    <div className="w-full  h-[16vh] flex font-['Roboto'] ">
      <div className="w-[25%] h-full rounded-xl overflow-hidden relative">
        <img className='w-full h-full object-cover'src={video.videoDetails.thumbnail} alt="" />
         <h3 className='absolute text-xs  font-[500] bottom-2 right-2 bg-primary/50 text-white px-1 py-0.5 rounded'>
          {formatDuration(video.videoDetails.duration)}
         </h3>
        </div>
      <div className="w-[75%] h-full flex flex-col   px-4">
       <div className="w-full h-fit flex justify-between  ">
   <h1 className='text-white text-xl w-[80%] '>{video.videoDetails.title}</h1>
   <div className="h-fit w-[20%] flex  justify-end gap-5 text-2xl items-center  ">
   <RxCross1 />
   <CgMoreVerticalAlt />
   </div>
       </div>
   
       <div className="w-full h-fit flex gap-4 text-[13px]  font-[500] text-zinc-400 ">
       <p>{video.ownerDetails.fullname}</p>
         <p>{formatViews(video.videoDetails.views)} views</p>
       </div>
       <div className="w-full h-fit flex gap-4 text-[13px] text-zinc-400 font-[500] pr-3">
       
         <p>{video.videoDetails.description.slice(0,230)+"..."}</p>
       </div>
      </div>
    </div>
  )
}

export default WatchVideoCont
