import React, { useEffect } from 'react'
import axios from 'axios'
const LikedVideos = () => {
  useEffect(() => {
    const getAllLikedVideos = async () => {
    const {data} = await axios.get("/like/LikedVideos")
    console.log(data.data)
    }
    getAllLikedVideos()
  },[])
  return (
    <div>
      <h1>dfsfc</h1>
      
    </div>
  )
}

export default LikedVideos
