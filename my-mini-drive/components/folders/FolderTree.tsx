"use client";

import { Tree } from "antd";
import { FolderOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { FolderType } from "@/types/folder";
import { useRouter } from "next/navigation";

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId?: string | null;
}

export default function FolderTree({
  folders,
  selectedFolderId,
}: FolderTreeProps) {
  const router = useRouter();

  const buildTreeData = (
    folders: FolderType[],
    parentId: string | null = null
  ): any[] => {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .map((folder) => ({
        title: folder.name,
        key: folder._id,
        icon: <FolderOutlined />,
        children: buildTreeData(folders, folder._id),
      }));
  };

  const treeData = buildTreeData(folders);

  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      router.push(`/drive?folderId=${selectedKeys[0]}`);
    }
  };

  return (
    <Tree
      showIcon
      treeData={treeData}
      selectedKeys={selectedFolderId ? [selectedFolderId] : []}
      onSelect={onSelect}
    />
  );
}

