"use client";

import { useState, useEffect } from "react";
import { Button, Space, Select, message } from "antd";
import {
  UploadOutlined,
  FolderAddOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import SearchBar from "@/components/common/SearchBar";
import FileGrid from "@/components/files/FileGrid";
import FileList from "@/components/files/FileList";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import UploadModal from "@/components/modals/UploadModal";
import RenameModal from "@/components/modals/RenameModal";
import DeleteConfirm from "@/components/modals/DeleteConfirm";
import TagModal from "@/components/modals/TagModal";
import DetailsModal from "@/components/modals/DetailsModal";
import { FileType } from "@/types/file";
import { FolderType } from "@/types/folder";

type ViewMode = "grid" | "list";

export default function Home() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchFiles();
    fetchTags();
  }, [search]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("sortBy", "updatedAt");
      params.append("sortOrder", "desc");

      const response = await fetch(`/api/files?${params}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      message.error("Failed to fetch files");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tag");
      const data = await response.json();
      setAvailableTags(data.tags || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = (action: string, file: FileType) => {
    setSelectedFile(file);
    switch (action) {
      case "upload":
        setUploadModalOpen(true);
        break;
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
    fetchFiles();
    fetchTags();
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
        <h1>Recent Files</h1>
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
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => handleAction("upload", null as any)}
          >
            Upload
          </Button>
        </Space>
      </div>

      {files.length === 0 ? (
        <EmptyState description="No files found. Upload your first file!" />
      ) : viewMode === "grid" ? (
        <FileGrid files={files} onAction={handleAction} />
      ) : (
        <FileList files={files} onAction={handleAction} />
      )}

      <UploadModal
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        onSuccess={handleRefresh}
        availableTags={availableTags}
      />
      <RenameModal
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onSuccess={handleRefresh}
        item={selectedFile}
        type="file"
      />
      <DeleteConfirm
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onSuccess={handleRefresh}
        file={selectedFile}
      />
      <TagModal
        open={tagModalOpen}
        onCancel={() => setTagModalOpen(false)}
        onSuccess={handleRefresh}
        file={selectedFile}
        availableTags={availableTags}
      />
      <DetailsModal
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        file={selectedFile}
      />
    </div>
  );
}
