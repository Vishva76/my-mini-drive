"use client";

import { Spin } from "antd";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
      }}
    >
      <Spin size="large" />
    </div>
  );
}

