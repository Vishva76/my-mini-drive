export interface FolderType {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderCreateData {
  name: string;
  parentId?: string | null;
}

