import { connectDB } from "@/lib/db";   
import FileHistory from "@/models/FileHistory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
    await connectDB();

    const history = await FileHistory.find({ fileId: params.fileId }).sort({ createdAt: -1 });

    return NextResponse.json({ history }, { status: 200 });

}

