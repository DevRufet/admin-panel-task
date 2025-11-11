import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ComponentTable from "../Table";

function MainLayout() {
  return (
    <div className="grid grid-cols-[1fr_6fr] ">
      <div
        style={{
          padding: "10px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          borderRight: "1px solid #F7F7F7",
        }}
      >
        <Sidebar></Sidebar>
      </div>
      <div style={{ padding: "0px" }}>
        <Header></Header>
        <div style={{ marginTop: "8px" }}>
          <ComponentTable></ComponentTable>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
