
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import File from "@/models/file";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const folderId = searchParams.get("folderId");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const tags = searchParams.get("tags");
    const isTrash = searchParams.get("trash") === "true";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const filter: any = { isDeleted: isTrash };

    if (folderId) {
      filter.folderId = folderId;
    } else if (!isTrash) {
      filter.folderId = null;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (type) {
      if (type === "image") {
        filter.mimeType = { $regex: "^image/", $options: "i" };
      } else if (type === "pdf") {
        filter.mimeType = { $regex: "^application/pdf", $options: "i" };
      } else if (type === "video") {
        filter.mimeType = { $regex: "^video/", $options: "i" };
      } else {
        filter.mimeType = { $regex: type, $options: "i" };
      }
    }

    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      filter.tags = { $in: tagArray };
    }

    const sort: any = {};
    if (sortBy === "name") {
      sort.name = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "size") {
      sort.size = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.updatedAt = sortOrder === "asc" ? 1 : -1;
    }

    const files = await File.find(filter)
      .populate("folderId")
      .sort(sort);

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}




