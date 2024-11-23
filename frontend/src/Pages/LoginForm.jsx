import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CategoryContext } from "../utils/Context";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Destructure the context correctly
  const { setLoggedInUser, loggedInUser } = useContext(CategoryContext);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/users/login", {
        username: data.username,
        password: data.password,
      });

      if (response.data.success) {
        setLoggedInUser(response.data.data.user); 
        console.log(response.data.data.user);
        
        console.log(loggedInUser.user);
        
        console.log("Login successful:", response.data);
        navigate("/"); // Redirect to the home page on success
      } else {
        console.error("Login failed:", response.data.message);
        // Optionally show an error message here
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle the error response (e.g., show an error message)
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            id="username"
            {...register("username", { required: "Username is required" })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? "border-red-500" : ""
            }`}
            type="text"
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            {...register("password", { required: "Password is required" })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password ? "border-red-500" : ""
            }`}
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
