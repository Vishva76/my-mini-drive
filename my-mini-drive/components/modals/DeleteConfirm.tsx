"use client";

import { Modal, message } from "antd";
import { useState } from "react";
import { FileType } from "@/types/file";

interface DeleteConfirmProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  file: FileType | null;
  permanent?: boolean;
}

export default function DeleteConfirm({
  open,
  onCancel,
  onSuccess,
  file,
  permanent = false,
}: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const url = `/api/files/${file._id}${permanent ? "?permanent=true" : ""}`;
      const response = await fetch(url, {
        method: permanent ? "DELETE" : "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      message.success(
        permanent
          ? "File permanently deleted"
          : "File moved to trash successfully"
      );
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Failed to delete file");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={permanent ? "Permanently Delete File" : "Move to Trash"}
      open={open}
      onCancel={onCancel}
      onOk={handleDelete}
      confirmLoading={loading}
      okText={permanent ? "Delete Permanently" : "Move to Trash"}
      okButtonProps={{ danger: true }}
    >
      <p>
        Are you sure you want to{" "}
        {permanent ? "permanently delete" : "move to trash"} the file{" "}
        <strong>{file?.name}</strong>?
        {permanent && (
          <span style={{ color: "red" }}>
            {" "}
            This action cannot be undone.
          </span>
        )}
      </p>
    </Modal>
  );
}

