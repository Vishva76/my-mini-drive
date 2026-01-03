"use client";

import { Layout, Menu } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  FolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link href="/">Recent Files</Link>,
    },
    {
      key: "/drive",
      icon: <FolderOutlined />,
      label: <Link href="/drive">My Drive</Link>,
    },
    {
      key: "/trash",
      icon: <DeleteOutlined />,
      label: <Link href="/trash">Trash</Link>,
    },
  ];

  return (
    <Sider width={200} style={{ minHeight: "100vh" }}>
      <div
        style={{
          padding: "16px",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        MiniDrive
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname || "/"]}
        items={menuItems}
      />
    </Sider>
  );
}

