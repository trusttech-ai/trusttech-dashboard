import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

const keyPath = path.join(process.cwd(), "gcp-key.json");
const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = "trusttech-storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder =
      searchParams.get("folder") || "approvals/lunna/approval-pending";

    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({
      prefix: folder,
      maxResults: 100,
    });

    const fileList = files
      .filter((file) => !file.name.endsWith("/")) // Remove folders
      .map((file) => ({
        name: file.name,
        fileName: path.basename(file.name),
        size: file.metadata.size,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated,
        contentType: file.metadata.contentType,
        url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
        folder: path.dirname(file.name),
      }));

    return NextResponse.json({
      success: true,
      files: fileList,
      total: fileList.length,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list files",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, action, comment = "" } = await request.json();

    if (!fileName || !action) {
      return NextResponse.json(
        { success: false, error: "Missing fileName or action" },
        { status: 400 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const sourceFile = bucket.file(fileName);

    // Check if file exists before attempting to move it
    const [exists] = await sourceFile.exists();
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: `File not found: ${fileName}`,
        },
        { status: 404 }
      );
    }

    // Extract the file basename to use in the new path
    const baseName = path.basename(fileName);

    // Create paths within the lunna directory
    let destinationPath;

    switch (action) {
      case "approve":
        destinationPath = `approvals/lunna/approved/${baseName}`;
        break;
      case "reject":
        destinationPath = `approvals/lunna/rejected/${baseName}`;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action. Use 'approve' or 'reject'",
          },
          { status: 400 }
        );
    }

    // Create destination file reference
    const destinationFile = bucket.file(destinationPath);

    // Copy file first, then delete the original after successful copy
    console.log(`Moving ${fileName} to ${destinationPath}`);
    await sourceFile.copy(destinationFile);
    await sourceFile.delete();

    // Store action details in database if needed
    try {
      // Database logging code would go here
      // This is where you would store the comment if DB is set up
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue with the process even if DB fails
    }

    return NextResponse.json({
      success: true,
      message: `File ${action}ed successfully`,
      newPath: destinationPath,
    });
  } catch (error) {
    console.error("Error processing file action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process file action",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
