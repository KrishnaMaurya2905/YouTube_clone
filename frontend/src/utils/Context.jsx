// Context.jsx
import React, { createContext, useState } from "react";

export const CategoryContext = createContext();

const Context = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [categoryFilter, setcategoryFilter] = useState("latest");

  return (
    <CategoryContext.Provider
      value={{ categoryFilter, loggedInUser, setcategoryFilter, setLoggedInUser }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default Context;