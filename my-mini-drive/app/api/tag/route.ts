import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import File from "@/models/file";
import { addHistory } from "@/lib/services/history.service";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const files = await File.find({ isDeleted: false });
    const allTags = new Set<string>();

    files.forEach((file) => {
      if (file.tags && Array.isArray(file.tags)) {
        file.tags.forEach((tag: string) => allTags.add(tag));
      }
    });

    return NextResponse.json(
      { tags: Array.from(allTags) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fileId, tags } = body;

    if (!fileId || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "File ID and tags array are required" },
        { status: 400 }
      );
    }

    const file = await File.findById(fileId);

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    const oldTags = [...(file.tags || [])];
    file.tags = tags;
    await file.save();

    await addHistory({
      fileId: file._id.toString(),
      event: "TAGS_UPDATED",
      description: "File tags updated",
      meta: {
        oldTags,
        newTags: tags,
      },
    });

    return NextResponse.json(
      { message: "Tags updated successfully", file },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tags:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

