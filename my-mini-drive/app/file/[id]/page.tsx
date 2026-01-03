"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Space, Image, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Loader from "@/components/common/Loader";
import FileActions from "@/components/files/FileActions";
import RenameModal from "@/components/modals/RenameModal";
import DeleteConfirm from "@/components/modals/DeleteConfirm";
import TagModal from "@/components/modals/TagModal";
import DetailsModal from "@/components/modals/DetailsModal";
import { FileType } from "@/types/file";
import { getFileType } from "@/lib/validators";

const { Title, Text } = Typography;

export default function FilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;

  const [file, setFile] = useState<FileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchFile();
  }, [fileId]);

  const fetchFile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files/${fileId}`);
      const data = await response.json();
      setFile(data.file);
    } catch (error) {
      message.error("Failed to fetch file");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, file: FileType) => {
    switch (action) {
      case "rename":
        setRenameModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      case "tags":
        setTagModalOpen(true);
        break;
      case "details":
        setDetailsModalOpen(true);
        break;
      case "download":
        window.open(file.path, "_blank");
        break;
    }
  };

  const handleRefresh = () => {
    fetchFile();
  };

  if (loading) {
    return <Loader />;
  }

  if (!file) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Text type="secondary">File not found</Text>
        </div>
      </div>
    );
  }

  const fileType = getFileType(file.mimeType);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={2}>{file.name}</Title>
            <Text type="secondary">
              {new Date(file.updatedAt).toLocaleString()}
            </Text>
          </div>
          <FileActions file={file} onAction={handleAction} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          background: "#f5f5f5",
          borderRadius: 8,
          padding: 24,
        }}
      >
        {fileType === "image" ? (
          <Image
            src={file.path}
            alt={file.name}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            preview={{
              mask: "Preview",
            }}
          />
        ) : fileType === "pdf" ? (
          <iframe
            src={file.path}
            style={{ width: "100%", height: "70vh", border: "none" }}
            title={file.name}
          />
        ) : fileType === "video" ? (
          <video
            src={file.path}
            controls
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Preview not available for this file type
            </Text>
            <br />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleAction("download", file)}
              style={{ marginTop: 16 }}
            >
              Download File
            </Button>
          </div>
        )}
      </div>

      <RenameModal
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onSuccess={handleRefresh}
        item={file}
        type="file"
      />
      <DeleteConfirm
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onSuccess={() => router.push("/drive")}
        file={file}
      />
      <TagModal
        open={tagModalOpen}
        onCancel={() => setTagModalOpen(false)}
        onSuccess={handleRefresh}
        file={file}
      />
      <DetailsModal
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        file={file}
      />
    </div>
  );
}

