import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config({
  path:"./env"
})

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudnary sevices
      required: true,
    },
    coverImage: {
      type: String, // cloudnary sevices
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  try {
    return await jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
      },
        "CHSOR54cvWIC-40SCbbWRHSDKCIgfKFi$%-FRGHDS",
      {
        expiresIn:"1d",
      } 
    );
  } catch (error) {
    console.log(error,'error found while generathe access token');
  }
};
UserSchema.methods.generateRefreshToken = async function () {
  try {
    return await jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
      },
        "FDSDhghSG53TDDFGDfGFGgfdg78TGBSFVCG4556-3CV",
      {
        expiresIn: "10d",
      }
    );
  } catch (error) {
    console.log(error,"error found while generating refresh token");
  }
};


export const user = mongoose.model("User", UserSchema);
