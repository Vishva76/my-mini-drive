"use client";

import { useState, useEffect } from "react";
import { Button, Space, Select, message, Input } from "antd";
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
import BreadcrumbNav from "@/components/folders/BreadcrumbNav";
import UploadModal from "@/components/modals/UploadModal";
import RenameModal from "@/components/modals/RenameModal";
import DeleteConfirm from "@/components/modals/DeleteConfirm";
import TagModal from "@/components/modals/TagModal";
import DetailsModal from "@/components/modals/DetailsModal";
import { FileType } from "@/types/file";
import { FolderType } from "@/types/folder";
import { useSearchParams, useRouter } from "next/navigation";

type ViewMode = "grid" | "list";

export default function DrivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId") || null;

  const [files, setFiles] = useState<FileType[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);
  const [breadcrumbIds, setBreadcrumbIds] = useState<(string | null)[]>([]);

  useEffect(() => {
    fetchFiles();
    fetchFolders();
    fetchTags();
    updateBreadcrumb();
  }, [folderId, search, filterType, filterTags, sortBy]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (folderId) params.append("folderId", folderId);
      if (search) params.append("search", search);
      if (filterType) params.append("type", filterType);
      if (filterTags.length > 0) params.append("tags", filterTags.join(","));
      params.append("sortBy", sortBy);
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

  const fetchFolders = async () => {
    try {
      const params = new URLSearchParams();
      if (folderId) params.append("parentId", folderId);

      const response = await fetch(`/api/folders?${params}`);
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error(error);
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

  const updateBreadcrumb = async () => {
    if (!folderId) {
      setBreadcrumbPath([]);
      setBreadcrumbIds([]);
      return;
    }

    try {
      const response = await fetch(`/api/folders?parentId=${folderId}`);
      const data = await response.json();
      // Build breadcrumb path
      const path: string[] = [];
      const ids: (string | null)[] = [];
      let currentId: string | null = folderId;

      while (currentId) {
        const folderResponse = await fetch(`/api/folders?id=${currentId}`).then(
          (res) => res.json()
        );
        if (!folderResponse || !folderResponse.folders || folderResponse.folders.length === 0) break;
        const folderItem: FolderType = folderResponse.folders[0];
        path.unshift(folderItem.name);
        ids.unshift(currentId);
        currentId = folderItem.parentId;
      }

      setBreadcrumbPath(path);
      setBreadcrumbIds(ids);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = (action: string, file: FileType | FolderType) => {
    if ("mimeType" in file) {
      setSelectedFile(file as FileType);
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
          window.open((file as FileType).path, "_blank");
          break;
      }
    } else {
      setSelectedFolder(file as FolderType);
      switch (action) {
        case "rename":
          setRenameModalOpen(true);
          break;
        case "delete":
          // Handle folder delete
          break;
      }
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: folderId }),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      message.success("Folder created successfully");
      fetchFolders();
    } catch (error) {
      message.error("Failed to create folder");
      console.error(error);
    }
  };

  const handleNavigate = (targetFolderId: string | null) => {
    if (targetFolderId) {
      router.push(`/drive?folderId=${targetFolderId}`);
    } else {
      router.push("/drive");
    }
  };

  const handleRefresh = () => {
    fetchFiles();
    fetchFolders();
    fetchTags();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <BreadcrumbNav
          path={breadcrumbPath}
          folderIds={breadcrumbIds}
          onNavigate={handleNavigate}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>My Drive</h1>
        <Space>
          <SearchBar value={search} onChange={setSearch} />
          <Select
            placeholder="Filter by type"
            style={{ width: 150 }}
            allowClear
            value={filterType || undefined}
            onChange={setFilterType}
          >
            <Select.Option value="image">Images</Select.Option>
            <Select.Option value="pdf">PDFs</Select.Option>
            <Select.Option value="video">Videos</Select.Option>
          </Select>
          <Select
            mode="multiple"
            placeholder="Filter by tags"
            style={{ width: 200 }}
            value={filterTags}
            onChange={setFilterTags}
          >
            {availableTags.map((tag) => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
          >
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="updatedAt">Last Modified</Select.Option>
            <Select.Option value="size">Size</Select.Option>
          </Select>
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
            icon={<FolderAddOutlined />}
            onClick={handleCreateFolder}
          >
            New Folder
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload
          </Button>
        </Space>
      </div>

      {folders.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>Folders</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {folders.map((folder) => (
              <Button
                key={folder._id}
                icon={<FolderAddOutlined />}
                onClick={() => handleNavigate(folder._id)}
                style={{ marginBottom: 8 }}
              >
                {folder.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <EmptyState description="No files in this folder" />
      ) : viewMode === "grid" ? (
        <FileGrid files={files} onAction={handleAction} />
      ) : (
        <FileList files={files} onAction={handleAction} />
      )}

      <UploadModal
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        onSuccess={handleRefresh}
        folderId={folderId}
        availableTags={availableTags}
      />
      <RenameModal
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onSuccess={handleRefresh}
        item={selectedFile || selectedFolder}
        type={selectedFile ? "file" : "folder"}
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

