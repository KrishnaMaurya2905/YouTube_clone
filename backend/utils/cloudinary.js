import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dtkyjnbvf",
  api_key: process.env.CLOUDINARY_API_KEY || "622157511464487",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "f7iGAnIM6LGqoR0ssP7eFdy4KVE",
});

const uploadfiletocloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file has been uploaded on cloudinary", response.url);
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath, (err) => {
      console.log(
        err,
        "error found while deleting the localpathfile from the server"
      );
    });
  }
};

// detete clounary files util function
const deletefilefromcloudinary = async (publicid, resourceType = "image") => {
  try {
    if (!publicid) {
      console.log("No public ID provided.");
      return null;
    }

    // Specify the resource type (image, video, etc.)
    const response = await cloudinary.uploader.destroy(publicid, {
      resource_type: resourceType,
    });
    

    if (response.result === "not found") {
      console.log("File not found in Cloudinary.");
    } else {
      console.log("File has been deleted from Cloudinary:", response);
    }

    return response;
  } catch (error) {
    console.log("Error while deleting the file from Cloudinary:", error);
  }
};
export { uploadfiletocloudinary , deletefilefromcloudinary };
