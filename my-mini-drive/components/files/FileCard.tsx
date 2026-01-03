"use client";

import { Card, Image, Typography, Tag, Dropdown, Button } from "antd";
import {
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FileType } from "@/types/file";
import { formatFileSize, getFileType } from "@/lib/validators";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface FileCardProps {
  file: FileType;
  onAction: (action: string, file: FileType) => void;
}

export default function FileCard({ file, onAction }: FileCardProps) {
  const router = useRouter();
  const fileType = getFileType(file.mimeType);

  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <FileImageOutlined style={{ fontSize: 48, color: "#1890ff" }} />;
      case "pdf":
        return <FilePdfOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />;
      case "video":
        return (
          <PlayCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
        );
      default:
        return <FileOutlined style={{ fontSize: 48 }} />;
    }
  };

  const menuItems = [
    {
      key: "view",
      label: "View",
      onClick: () => router.push(`/file/${file._id}`),
    },
    {
      key: "details",
      label: "Details",
      onClick: () => onAction("details", file),
    },
    {
      key: "rename",
      label: "Rename",
      onClick: () => onAction("rename", file),
    },
    {
      key: "move",
      label: "Move",
      onClick: () => onAction("move", file),
    },
    {
      key: "tags",
      label: "Manage Tags",
      onClick: () => onAction("tags", file),
    },
    {
      type: "divider" as const,
    },
    {
      key: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onAction("delete", file),
    },
  ];

  return (
    <Card
      hoverable
      style={{ width: 200, margin: 8 }}
      bodyStyle={{ padding: 16, textAlign: "center" }}
      actions={[
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} key="more">
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>,
      ]}
      onClick={() => router.push(`/file/${file._id}`)}
    >
      <div style={{ marginBottom: 12 }}>
        {fileType === "image" && file.path ? (
          <Image
            src={file.path}
            alt={file.name}
            width={120}
            height={120}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        ) : (
          getFileIcon()
        )}
      </div>
      <Text strong ellipsis style={{ display: "block", marginBottom: 8 }}>
        {file.name}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {formatFileSize(file.size)}
      </Text>
      {file.tags && file.tags.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {file.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} size="small">
              {tag}
            </Tag>
          ))}
          {file.tags.length > 2 && (
            <Tag size="small">+{file.tags.length - 2}</Tag>
          )}
        </div>
      )}
    </Card>
  );
}

