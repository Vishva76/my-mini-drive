"use client";

import { useState, useEffect } from "react";
import { Button, Space, message } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  RestoreOutlined,
} from "@ant-design/icons";
import SearchBar from "@/components/common/SearchBar";
import FileGrid from "@/components/files/FileGrid";
import FileList from "@/components/files/FileList";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import DeleteConfirm from "@/components/modals/DeleteConfirm";
import { FileType } from "@/types/file";

type ViewMode = "grid" | "list";

export default function TrashPage() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [search]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("trash", "true");
      if (search) params.append("search", search);

      const response = await fetch(`/api/files?${params}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      message.error("Failed to fetch trash files");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, file: FileType) => {
    setSelectedFile(file);
    switch (action) {
      case "delete":
      case "permanent-delete":
        setDeleteModalOpen(true);
        break;
      case "restore":
        handleRestore(file);
        break;
    }
  };

  const handleRestore = async (file: FileType) => {
    try {
      const response = await fetch(`/api/files/${file._id}`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Restore failed");

      message.success("File restored successfully");
      fetchFiles();
    } catch (error) {
      message.error("Failed to restore file");
      console.error(error);
    }
  };

  const handleRefresh = () => {
    fetchFiles();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>Trash</h1>
        <Space>
          <SearchBar value={search} onChange={setSearch} />
          <Button
            icon={<AppstoreOutlined />}
            type={viewMode === "grid" ? "primary" : "default"}
            onClick={() => setViewMode("grid")}
          />
          <Button
            icon={<UnorderedListOutlined />}
            type={viewMode === "list" ? "primary" : "default"}
            onClick={() => setViewMode("list")}
          />
        </Space>
      </div>

      {files.length === 0 ? (
        <EmptyState description="Trash is empty" />
      ) : viewMode === "grid" ? (
        <FileGrid files={files} onAction={handleAction} />
      ) : (
        <FileList files={files} onAction={handleAction} />
      )}

      <DeleteConfirm
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onSuccess={handleRefresh}
        file={selectedFile}
        permanent={true}
      />
    </div>
  );
}

