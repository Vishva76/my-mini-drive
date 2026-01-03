import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Folder from "@/models/folder";
import {
  createFolder,
  getFolderById,
  getFoldersByParent,
  updateFolder,
  deleteFolder,
} from "@/lib/services/folder.service";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const id = searchParams.get("id");

    if (id) {
      const folder = await getFolderById(id);
      if (!folder) {
        return NextResponse.json(
          { message: "Folder not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ folders: [folder] }, { status: 200 });
    }

    const folders = await getFoldersByParent(parentId || null);

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
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
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await createFolder(name, parentId || null);

    return NextResponse.json(
      { message: "Folder created successfully", folder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { message: "Folder ID and name are required" },
        { status: 400 }
      );
    }

    const folder = await updateFolder(id, name);

    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Folder updated successfully", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Folder ID is required" },
        { status: 400 }
      );
    }

    await deleteFolder(id);

    return NextResponse.json(
      { message: "Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

