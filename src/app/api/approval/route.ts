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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (filePath) {
      where.filePath = {
        contains: filePath,
      };
    }

    // Add date range filtering
    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt.lt = endDateObj;
      }
    }

    const approvalActions = await prisma.approvalAction.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Approval actions found:", approvalActions);

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

    console.log(`Processing file action: ${fileName}, baseName: ${baseName}`);

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
      const [log] = await prisma.uploadLog.findMany({
        where: {
          fileName: baseName,
        },
      });

      await prisma.approvalAction.create({
        data: {
          fileName: baseName,
          filePath: log.filePath ?? "",
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
      message: `File ${action} successfully`,
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

export async function PATCH(request: NextRequest) {
  try {
    const { id, action, comment } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing approval action id" },
        { status: 400 }
      );
    }

    const existingAction = await prisma.approvalAction.findUnique({
      where: { id },
    });

    if (!existingAction) {
      return NextResponse.json(
        { success: false, error: "Approval action not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (action) updateData.action = action;
    if (comment) updateData.comment = comment;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No data provided for update" },
        { status: 400 }
      );
    }

    // Inicializar com o caminho atual
    let updatedFilePath = existingAction.filePath;

    // Se a ação mudou, precisamos mover o arquivo
    if (action && action !== existingAction.action) {
      const bucket = storage.bucket(bucketName);
      const baseName = path.basename(existingAction.filePath);
      const sourceFile = bucket.file(existingAction.filePath);

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
              error: "Invalid action. Use 'APPROVE', 'REJECTED', or 'PENDING'",
            },
            { status: 400 }
          );
      }

      const [exists] = await sourceFile.exists();

      if (exists) {
        console.log(`Moving ${existingAction.filePath} to ${destinationPath}`);
        const destinationFile = bucket.file(destinationPath);
        await sourceFile.copy(destinationFile);
        await sourceFile.delete();

        // Atualizar o caminho do arquivo
        updateData.filePath = destinationPath;
        updatedFilePath = destinationPath;
      }
    }

    // Atualizar a ação no banco de dados
    const updatedAction = await prisma.approvalAction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Approval action updated successfully",
      approvalAction: {
        ...updatedAction,
        url: `https://storage.googleapis.com/${bucketName}/${updatedFilePath}`,
      },
    });
  } catch (error) {
    console.error("Error updating approval action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update approval action",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
