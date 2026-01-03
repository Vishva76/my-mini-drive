"use client";

import { Modal, Upload, Button, Form, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile } from "antd";

const { Option } = Select;

interface UploadModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  folderId?: string | null;
  availableTags?: string[];
}

export default function UploadModal({
  open,
  onCancel,
  onSuccess,
  folderId,
  availableTags = [],
}: UploadModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      if (folderId) {
        formData.append("folderId", folderId);
      }
      formData.append("tags", JSON.stringify(values.tags || []));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      message.success("File uploaded successfully");
      form.resetFields();
      setFileList([]);
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Failed to upload file");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Upload File"
      open={open}
      onCancel={onCancel}
      onOk={handleUpload}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="file" rules={[{ required: true, message: "Please select a file" }]}>
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Add tags"
            style={{ width: "100%" }}
            tokenSeparators={[","]}
          >
            {availableTags.map((tag) => (
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

