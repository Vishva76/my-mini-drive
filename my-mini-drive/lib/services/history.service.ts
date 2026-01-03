import FileHistory from "@/models/FileHistory";

interface HistoryService {
  fileId: string;
  event:
    | "CREATED"
    | "DELETED"
    | "RENAMED"
    | "MOVED"
    | "RESTORED"
    | "TAGS_UPDATED";
  description: string;
  meta?: Record<string, any>;
}

export async function addHistory(data: HistoryService) {
  return await FileHistory.create({
    fileId: data.fileId,
    event: data.event,
    meta: data.meta || {},
  });
}