import React, { useState } from "react";

import { ChevronDown, ChevronUp, Home, Settings } from "lucide-react";

const menuItems = [
  { label: "Post", key: "post" },
  { label: "Media Library", key: "media" },
  { label: "System Settings", key: "settings" },
];

const TailwindCustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const triggerClass = isOpen
    ? "bg-[#284994]  text-[#FFFFFF]"
    : "bg-[#ffffff]  shadow-md font-lato font-medium text-[14px] leading-[20px] tracking-[-0.01em] text-[#787486]";

  return (
    <div className="w-[255px] font-sans p-2  rounded-[12px] flex flex-col gap-[10px]">
      <button
        onClick={handleToggle}
        className={`
                    ${triggerClass}
                    w-full h-[50px] flex justify-between items-center 
                    py-3 px-4 mb-2 p-[10px]
                    rounded-[12px] transition duration-200 
                    font-semibold cursor-pointer 
                `}
      >
        <div className="flex items-center text-[#787486] gap-[7px]">
          <Home className="w-5 h-5 mr-3" />
          NAA Website
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#FFFFFF]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#787486]" />
        )}
      </button>

      {isOpen && (
        <div className="bg-[#FFFFFF] rounded-lg shadow-lg overflow-hidden mt-3 p-[10px] gap-[15px] flex flex-col font-lato font-medium text-[14px] leading-[20px] tracking-[-0.01em] text-[#787486] rounded-[12px] border border-[#F7F7F7]">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className="
                                px-4 py-3 
                                text-[#787486] font-medium text-base
                                cursor-pointer hover:bg-gray-100 transition duration-150
                            "
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TailwindCustomDropdown;
