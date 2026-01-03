import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import file from "@/models/file";
import FileHistory from "@/models/FileHistory"; 
import { addHistory } from "@/lib/services/history.service";
import { saveFile } from "@/lib/services/file.service";


export async function POST(request: NextRequest) {
    try{

        await connectDB();

        const formData = await request.formData();
        const fileData = formData.get("file") as File;
        const folderIdParam = formData.get("folderId") as string | null;
        const folderId = folderIdParam && folderIdParam !== "null" ? folderIdParam : null;
        const tagsParam = formData.get("tags") as string;
        let tags: string[] = [];
        try {
          tags = tagsParam ? JSON.parse(tagsParam) : [];
        } catch {
          tags = [];
        }

        if (!fileData) {
            return NextResponse.json({ message: "File Not found" }, { status: 400 });
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());

        const saved = saveFile(buffer, fileData.name);

        const newFile = await file.create({
            name: fileData.name,    
            originalName: fileData.name,
            path: saved.path,
            mimeType: fileData.type,
            size: fileData.size,
            folderId,
            tags,

        });


        await addHistory({
      fileId: newFile._id.toString(),
      event: "CREATED",
      description: "File uploaded",
    });

    
        return NextResponse.json({ message: "File uploaded successfully", file: newFile }, { status: 201 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });

    }
}