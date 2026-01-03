"use client";

import { Modal, Form, Select, message } from "antd";
import { useState, useEffect } from "react";
import { FileType } from "@/types/file";

const { Option } = Select;

interface TagModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  file: FileType | null;
  availableTags?: string[];
}

export default function TagModal({
  open,
  onCancel,
  onSuccess,
  file,
  availableTags = [],
}: TagModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/tag")
        .then((res) => res.json())
        .then((data) => setTags(data.tags || []))
        .catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (open && file) {
      form.setFieldsValue({ tags: file.tags || [] });
    }
  }, [open, file, form]);

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await fetch("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: file._id,
          tags: values.tags || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Update tags failed");
      }

      message.success("Tags updated successfully");
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Failed to update tags");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set([...tags, ...availableTags]));

  return (
    <Modal
      title="Manage Tags"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Add tags"
            style={{ width: "100%" }}
            tokenSeparators={[","]}
          >
            {allTags.map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

