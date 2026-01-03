"use client";

import { Modal, Descriptions, Tag, Timeline } from "antd";
import { FileType } from "@/types/file";
import { FileHistoryType } from "@/types/history";
import { formatFileSize, getFileType } from "@/lib/validators";
import { useEffect, useState } from "react";

interface DetailsModalProps {
  open: boolean;
  onCancel: () => void;
  file: FileType | null;
}

export default function DetailsModal({
  open,
  onCancel,
  file,
}: DetailsModalProps) {
  const [history, setHistory] = useState<FileHistoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && file) {
      setLoading(true);
      fetch(`/api/history/${file._id}`)
        .then((res) => res.json())
        .then((data) => setHistory(data.history || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, file]);

  if (!file) return null;

  return (
    <Modal
      title="File Details"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Name">{file.name}</Descriptions.Item>
        <Descriptions.Item label="Original Name">
          {file.originalName}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag>{getFileType(file.mimeType)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Size">
          {formatFileSize(file.size)}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {new Date(file.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified">
          {new Date(file.updatedAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Tags">
          {file.tags && file.tags.length > 0 ? (
            file.tags.map((tag) => (
              <Tag key={tag} style={{ marginBottom: 4 }}>
                {tag}
              </Tag>
            ))
          ) : (
            <span style={{ color: "#999" }}>No tags</span>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <h3>History</h3>
        <Timeline
          items={history.map((item) => ({
            color:
              item.event === "CREATED"
                ? "green"
                : item.event === "DELETED"
                ? "red"
                : "blue",
            children: (
              <div>
                <div style={{ fontWeight: "bold" }}>{item.event}</div>
                <div style={{ color: "#666", fontSize: 12 }}>
                  {item.description}
                </div>
                <div style={{ color: "#999", fontSize: 11 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </Modal>
  );
}

