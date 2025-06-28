import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const fileNameFilter = searchParams.get("fileName");
    
    // Filter options for query
    const where = fileNameFilter 
      ? { fileName: { contains: fileNameFilter } }
      : {};

    // Get approval actions from database
    const approvalActions = await prisma.approvalAction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      approvalActions,
    });
  } catch (error) {
    console.error("Error fetching approval history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch approval history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}