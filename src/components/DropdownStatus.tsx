import React from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    key: "2",
    label: " Active",
  },
  {
    key: "3",
    label: "Inactive",
  },
];

const StatusDropdown: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space className="w-[146px] h-[36px] flex justify-between opacity-100 border border border-[#E5E7EB] p-[10px] rounded-[10px] pr-3 pl-3 bg-[#FFFFFF]">
        All Status
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default StatusDropdown;
