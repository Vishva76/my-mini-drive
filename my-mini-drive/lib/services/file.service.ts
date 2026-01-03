import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export function saveFile(buffer: Buffer, originalName: string) {
  ensureUploadDir();

  const ext = path.extname(originalName);
  const filename = crypto.randomUUID() + ext;
  const filePath = path.join(UPLOAD_DIR, filename);

  fs.writeFileSync(filePath, buffer);

  return {
    filename,
    path: `/uploads/${filename}`,
  };
}
