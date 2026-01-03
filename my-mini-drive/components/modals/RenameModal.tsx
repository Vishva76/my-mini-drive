"use client";

import { Modal, Form, Input, message } from "antd";
import { useState } from "react";
import { FileType } from "@/types/file";
import { FolderType } from "@/types/folder";

interface RenameModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  item: FileType | FolderType | null;
  type: "file" | "folder";
}

export default function RenameModal({
  open,
  onCancel,
  onSuccess,
  item,
  type,
}: RenameModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const url = type === "file" ? `/api/files/${item?._id}` : `/api/folders`;
      const method = type === "file" ? "PATCH" : "PATCH";
      const body =
        type === "file"
          ? { name: values.name }
          : { id: item?._id, name: values.name };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Rename failed");
      }

      message.success(`${type === "file" ? "File" : "Folder"} renamed successfully`);
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(`Failed to rename ${type}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Rename ${type === "file" ? "File" : "Folder"}`}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      afterOpenChange={(visible) => {
        if (visible && item) {
          form.setFieldsValue({ name: item.name });
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: `Please enter ${type} name` }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

