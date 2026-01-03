"use client";

import { List, Typography, Tag, Dropdown, Button } from "antd";
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

interface FileListProps {
  files: FileType[];
  onAction: (action: string, file: FileType) => void;
}

export default function FileList({ files, onAction }: FileListProps) {
  const router = useRouter();

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return (
          <FileImageOutlined style={{ fontSize: 24, color: "#1890ff" }} />
        );
      case "pdf":
        return <FilePdfOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />;
      case "video":
        return (
          <PlayCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
        );
      default:
        return <FileOutlined style={{ fontSize: 24 }} />;
    }
  };

  return (
    <List
      dataSource={files}
      renderItem={(file) => {
        const fileType = getFileType(file.mimeType);
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
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/file/${file._id}`)}
            actions={[
              <Dropdown menu={{ items: menuItems }} trigger={["click"]} key="more">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              avatar={getFileIcon(fileType)}
              title={<Text strong>{file.name}</Text>}
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatFileSize(file.size)} •{" "}
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </Text>
                  {file.tags && file.tags.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      {file.tags.map((tag) => (
                        <Tag key={tag} size="small">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
}

