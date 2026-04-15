import { useState } from "react";
import SoDoanQuanLy from "./SoDoanQuanLy";
import SoDoanDuyet from "./SoDoanDuyet";
import "./SoDoan.css";

const SoDoan = () => {
  const [activeTab, setActiveTab] = useState("quanly");

  return (
    <div className="so-doan-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="so-doan-title">Sổ Đoàn</h1>
      </div>

      <div className="so-doan-tabs-container">
        <button
          className={`so-doan-tab ${activeTab === "quanly" ? "active" : ""}`}
          onClick={() => setActiveTab("quanly")}
        >
          Quản lý sổ Đoàn
        </button>
        <button
          className={`so-doan-tab ${activeTab === "duyet" ? "active" : ""}`}
          onClick={() => setActiveTab("duyet")}
        >
          Duyệt tiếp nhận sổ
        </button>
      </div>

      {activeTab === "quanly" && <SoDoanQuanLy />}
      {activeTab === "duyet" && <SoDoanDuyet />}
    </div>
  );
};

export default SoDoan;
