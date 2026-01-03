export function validateFileName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  if (name.length > 255) {
    return false;
  }
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(name);
}

export function validateFolderName(name: string): boolean {
  return validateFileName(name);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
}

export function isValidMimeType(mimeType: string): boolean {
  return /^[a-z]+\/[a-z0-9\-\+\.]+$/i.test(mimeType);
}

