export interface FileType {
  _id: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  folderId: string | null;
  tags: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface FileUploadData {
  file: File;
  folderId?: string | null;
  tags?: string[];
}

export interface FileUpdateData {
  name?: string;
  folderId?: string | null;
  tags?: string[];
}

