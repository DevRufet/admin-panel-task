import React from "react";
import PostDropdown from "../DropdownPost";
import StatusDropdown from "../DropdownStatus";
import ModalComponent from "../ModalComponent";

function Header() {
  return (
    <>
      <div className="flex justify-between" style={{ padding: "13px" }}>
        <div>
          <p className="font-lato font-medium text-[24px] leading-[32px] tracking-[0] text-[#000000] mb-[5px]">
            News & Announcements
          </p>
          <p className="font-lato font-medium text-[14px] leading-[20px] tracking-[-0.01em] text-[#787486]">
            210 Posts
          </p>
        </div>
        <ModalComponent></ModalComponent>
      </div>
      <div className="w-[full]  flex  gap-[10px] opacity-100 border border-[#F7F7F7] rounded-[12px] p-[20px] bg-[#FFFFFF]">
        <PostDropdown></PostDropdown>
        <StatusDropdown></StatusDropdown>
        <input
          type="text"
          placeholder="Search..."
          className="w-[216px] h-[36px] flex items-center p-[10px] gap-2 opacity-100 border border border-[#E5E7EB] rounded-[10px] pt-1 pb-1 pr-3 pl-3 bg-[#FFFFFF]"
        />
      </div>
    </>
  );
}

export default Header;
