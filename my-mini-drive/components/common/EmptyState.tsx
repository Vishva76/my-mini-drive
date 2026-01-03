"use client";

import { Empty } from "antd";

interface EmptyStateProps {
  description?: string;
  image?: React.ReactNode;
}

export default function EmptyState({
  description = "No files found",
  image,
}: EmptyStateProps) {
  return <Empty description={description} image={image} />;
}

