import React from "react";

const NavIcons = ({ icon, img, text, isActive }) => {
  return (
    <div
      className={`flex items-center text-[1.5rem] ml-2 font-["poppins"] gap-[18%] px-[10px] py-[8px] rounded-lg hover:bg-secondary font-[400] ${
        isActive && "bg-secondary"
      } w-[85%] `}
    >
      {icon && icon}
      {img && (
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img className="h-full w-full object-contain" src={img} alt="" />
        </div>
      )}
      <p className="text-base">{text}</p>
    </div>
  );
};

export default NavIcons;
