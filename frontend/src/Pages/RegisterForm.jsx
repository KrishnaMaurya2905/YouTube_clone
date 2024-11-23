import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();

  // For displaying the uploaded image preview
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");

  // Watch password fields to ensure matching
  const password = watch("password", "");

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullname", data.fullname);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]);
      formData.append("coverImage", data.coverImage[0]);

      const response = await axios.post("/users/register", formData);
      console.log(response.data);

      // Reset the form after successful registration
      reset();
      setAvatarPreview(""); // Clear avatar preview
      setCoverImagePreview(""); // Clear cover image preview
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  // Handle image preview for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle image preview for cover image
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* Username */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            className={`w-full px-4 py-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            type="text"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            className={`w-full px-4 py-2 border ${
              errors.fullname ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            type="text"
            {...register("fullname", { required: "Full name is required" })}
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Avatar */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Avatar</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            {...register("avatar", { required: "Avatar is required" })}
            onChange={handleAvatarChange}
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
          )}
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-4 w-40 h-24 object-cover rounded-md"
            />
          )}
        </div>

        {/* Cover Image */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Cover Image</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            {...register("coverImage", { required: "Cover image is required" })}
            onChange={handleCoverImageChange}
          />
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>
          )}
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Cover Image Preview"
              className="mt-4 w-40 h-24 object-cover rounded-md"
            />
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            className={`w-full px-4 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            className={`w-full px-4 py-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded transition-transform transform ${
              isSubmitting ? "scale-95 opacity-50" : "hover:scale-105"
            } focus:outline-none focus:ring-2 focus:ring-blue-600`}
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
