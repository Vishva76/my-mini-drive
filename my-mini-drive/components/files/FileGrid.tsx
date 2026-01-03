"use client";

import { Row, Col } from "antd";
import { FileType } from "@/types/file";
import FileCard from "./FileCard";

interface FileGridProps {
  files: FileType[];
  onAction: (action: string, file: FileType) => void;
}

export default function FileGrid({ files, onAction }: FileGridProps) {
  return (
    <Row gutter={[16, 16]}>
      {files.map((file) => (
        <Col key={file._id}>
          <FileCard file={file} onAction={onAction} />
        </Col>
      ))}
    </Row>
  );
}

