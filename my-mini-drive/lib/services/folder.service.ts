import Folder from "@/models/folder";

export async function createFolder(name: string, parentId: string | null = null) {
  return await Folder.create({
    name,
    parentId: parentId || null,
  });
}

export async function getFolderById(id: string) {
  return await Folder.findById(id);
}

export async function getFoldersByParent(parentId: string | null = null) {
  return await Folder.find({ parentId: parentId || null });
}

export async function updateFolder(id: string, name: string) {
  return await Folder.findByIdAndUpdate(id, { name }, { new: true });
}

export async function deleteFolder(id: string) {
  return await Folder.findByIdAndDelete(id);
}

export async function getFolderPath(folderId: string | null): Promise<string[]> {
  const path: string[] = [];
  let currentId = folderId;

  while (currentId) {
    const folder = await Folder.findById(currentId);
    if (!folder) break;
    path.unshift(folder.name);
    currentId = folder.parentId?.toString() || null;
  }

  return path;
}

