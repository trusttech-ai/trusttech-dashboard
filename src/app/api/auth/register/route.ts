import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = "USER", document } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashed,
          name,
          role,
          document,
          lastLogin: new Date(),
          settings: {
            create: {
              theme: "dark",
              emailNotifications: true,
            },
          },
        },
        include: {
          settings: true,
        },
      });

      return newUser;
    });

    // Retorna os dados do usuário para o AuthContext
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      document: user.document,
      isActive: user.isActive,
      createdAt: user.createdAt,
      settings: {
        theme: user.settings?.theme,
        emailNotifications: user.settings?.emailNotifications,
      },
    });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);

    // Tratamento de erros específicos
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Email já registrado" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
