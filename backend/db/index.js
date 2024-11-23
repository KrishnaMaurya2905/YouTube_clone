import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`mongodb+srv://luci44389:QLhBPXN9zAgVBv00@cluster0.lldrdnb.mongodb.net/backregister`);
    
    console.log(`MONGODB CONNECTED !! HOST: 8000`);

    process.on("SIGINT", () => {
      connection.connection.close(() => { 
        console.log("MongoDB connection is closed.");
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error("MONGODB CONNECTION FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;
