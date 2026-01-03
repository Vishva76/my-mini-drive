"use client";

import { Button, Space, Dropdown } from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  TagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FileType } from "@/types/file";

interface FileActionsProps {
  file: FileType;
  onAction: (action: string, file: FileType) => void;
  isTrash?: boolean;
}

export default function FileActions({
  file,
  onAction,
  isTrash = false,
}: FileActionsProps) {
  const menuItems = [
    {
      key: "rename",
      label: "Rename",
      icon: <EditOutlined />,
      onClick: () => onAction("rename", file),
    },
    {
      key: "tags",
      label: "Manage Tags",
      icon: <TagOutlined />,
      onClick: () => onAction("tags", file),
    },
    {
      key: "move",
      label: "Move",
      onClick: () => onAction("move", file),
    },
    {
      type: "divider" as const,
    },
    {
      key: "delete",
      label: isTrash ? "Permanently Delete" : "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onAction(isTrash ? "permanent-delete" : "delete", file),
    },
  ];

  if (isTrash) {
    menuItems.unshift({
      key: "restore",
      label: "Restore",
      onClick: () => onAction("restore", file),
    });
  }

  return (
    <Space>
      <Button
        icon={<DownloadOutlined />}
        onClick={() => onAction("download", file)}
      >
        Download
      </Button>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Button icon={<MoreOutlined />}>More</Button>
      </Dropdown>
    </Space>
  );
}

