export type HistoryEventType =
  | "CREATED"
  | "RENAMED"
  | "MOVED"
  | "TAGS_UPDATED"
  | "DELETED"
  | "RESTORED";

export interface FileHistoryType {
  _id: string;
  fileId: string;
  event: HistoryEventType;
  description: string;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

