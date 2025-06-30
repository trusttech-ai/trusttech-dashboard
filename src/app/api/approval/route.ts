import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { PrismaClient } from "@prisma/client";
import path from "path";

const keyPath = path.join(process.cwd(), "gcp-key.json");
const prisma = new PrismaClient();
const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = "trusttech-storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const filePath = searchParams.get("filePath");

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (filePath) {
      console.log("File path provided:", filePath);
      where.filePath = {
        contains: `filePath`,
      };
    }

    const approvalActions = await prisma.approvalAction.findMany({
      where,
    });

    const enrichedActions = approvalActions.map((action) => ({
      ...action,
      url: `https://storage.googleapis.com/${bucketName}/${action.filePath}`,
    }));

    return NextResponse.json({
      success: true,
      approvalActions: enrichedActions,
    });
  } catch (error) {
    console.error("Error fetching approval history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Nenhum histórico de aprovação encontrado",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, action = "PENDING", comment } = await request.json();

    if (!fileName || !action) {
      return NextResponse.json(
        { success: false, error: "Missing fileName or action" },
        { status: 400 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const sourceFile = bucket.file(fileName);
    const baseName = path.basename(fileName);

    const [exists] = await sourceFile.exists();

    let destinationPath;

    switch (action) {
      case "APPROVE":
        destinationPath = `approvals/lunna/approved/${baseName}`;
        break;
      case "REJECTED":
        destinationPath = `approvals/lunna/rejected/${baseName}`;
        break;
      case "PENDING":
        destinationPath = `approvals/lunna/approval-pending/${baseName}`;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action. Use 'APPROVE' or 'REJECTED'",
          },
          { status: 400 }
        );
    }

    const destinationFile = bucket.file(destinationPath);

    if (exists) {
      console.log(`Moving ${fileName} to ${destinationPath}`);
      await sourceFile.copy(destinationFile);
      await sourceFile.delete();
    }

    try {
      // Procurar log do arquivo

      const [log] = await prisma.uploadLog.findMany({
        where: {
          fileName: baseName,
        },
      });

      await prisma.approvalAction.create({
        data: {
          fileName: baseName,
          filePath: destinationPath,
          action: action,
          comment: comment || "",
          logId: log?.id,
          userId: "system",
        },
      });
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
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
