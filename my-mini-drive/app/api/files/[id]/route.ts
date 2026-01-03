import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import File from "@/models/file";
import { addHistory } from "@/lib/services/history.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const file = await File.findById(params.id).populate("folderId");

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ file }, { status: 200 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = params;
    const { name, folderId, tags } = body;

    const fileData = await File.findById(id);

    if (!fileData) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    const oldData = {
      name: fileData.name,
      folderId: fileData.folderId?.toString() || null,
      tags: [...(fileData.tags || [])],
    };

    let eventType: "RENAMED" | "MOVED" | "TAGS_UPDATED" = "RENAMED";

    if (name !== undefined) {
      fileData.name = name;
      eventType = "RENAMED";
    }
    if (folderId !== undefined) {
      fileData.folderId = folderId || null;
      eventType = "MOVED";
    }
    if (tags !== undefined) {
      fileData.tags = tags;
      eventType = "TAGS_UPDATED";
    }

    await fileData.save();

    await addHistory({
      fileId: fileData._id.toString(),
      event: eventType,
      description: `File ${eventType.toLowerCase()}`,
      meta: {
        oldData,
        newData: {
          name: fileData.name,
          folderId: fileData.folderId?.toString() || null,
          tags: fileData.tags || [],
        },
      },
    });

    return NextResponse.json(
      { message: "File updated successfully", file: fileData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}   

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    const file = await File.findById(params.id);

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    if (permanent) {
      await File.findByIdAndDelete(params.id);
      await addHistory({
        fileId: params.id,
        event: "DELETED",
        description: "File permanently deleted",
      });
      return NextResponse.json(
        { message: "File permanently deleted" },
        { status: 200 }
      );
    }

    if (file.isDeleted) {
      return NextResponse.json(
        { message: "File already in trash" },
        { status: 400 }
      );
    }

    file.isDeleted = true;
    await file.save();

    await addHistory({
      fileId: file._id.toString(),
      event: "DELETED",
      description: "File moved to trash",
    });

    return NextResponse.json(
      { message: "File moved to trash successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const file = await File.findById(params.id);

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    if (!file.isDeleted) {
      return NextResponse.json(
        { message: "File is not in trash" },
        { status: 400 }
      );
    }

    file.isDeleted = false;
    await file.save();

    await addHistory({
      fileId: file._id.toString(),
      event: "RESTORED",
      description: "File restored from trash",
    });

    return NextResponse.json(
      { message: "File restored successfully", file },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error restoring file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
