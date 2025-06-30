import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const limit = parseInt(searchParams.get("limit") || "150");
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const order = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

    const validSortFields = [
      "fileName",
      "fileSize",
      "createdAt",
      "updatedAt",
      "status",
    ];

    const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const whereClause: any = {};

    if (fileName) {
      whereClause.fileName = {
        contains: fileName,
      };
    }

    const skip = (page - 1) * limit;

    const orderBy: any = {};
    orderBy[field] = order;

    const logs = await prisma.uploadLog.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      include: {
        approvalActions: true,
      },
    });

    const totalCount = await prisma.uploadLog.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      count: logs.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      sortBy: field,
      sortOrder: order,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve logs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      fileName,
      fileType,
      fileSize,
      filePath,
      userId = "system",
      uploadedBy,
    } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "Missing fileName" },
        { status: 400 }
      );
    }

    try {
      const uploadLog = await prisma.uploadLog.create({
        data: {
          fileName,
          fileType: fileType || null,
          fileSize: fileSize ? Number(fileSize) : null,
          filePath: filePath || null,
          uploadedBy: uploadedBy || userId,
          ipAddress: request.headers.get("x-forwarded-for") || "" || null,
          userAgent: request.headers.get("user-agent") || null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "File log created successfully",
        uploadLog,
      });
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Database operation failed",
          message:
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing file log:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process file log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
