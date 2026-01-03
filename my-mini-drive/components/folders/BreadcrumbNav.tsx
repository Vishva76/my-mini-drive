"use client";

import { Breadcrumb } from "antd";
import { HomeOutlined, FolderOutlined } from "@ant-design/icons";
import Link from "next/link";

interface BreadcrumbNavProps {
  path: string[];
  folderIds: (string | null)[];
  onNavigate: (folderId: string | null) => void;
}

export default function BreadcrumbNav({
  path,
  folderIds,
  onNavigate,
}: BreadcrumbNavProps) {
  const items = [
    {
      title: (
        <Link href="/drive" onClick={() => onNavigate(null)}>
          <HomeOutlined /> My Drive
        </Link>
      ),
    },
    ...path.map((name, index) => ({
      title: (
        <span
          onClick={() => onNavigate(folderIds[index])}
          style={{ cursor: "pointer" }}
        >
          <FolderOutlined /> {name}
        </span>
      ),
    })),
  ];

  return <Breadcrumb items={items} />;
}

