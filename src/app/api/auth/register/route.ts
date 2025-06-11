import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = "USER" } = await req.json();

    // Valida os dados obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashed = await bcrypt.hash(password, 10);

    // Cria o usuário com transação para garantir que UserSettings seja criado
    const user = await prisma.$transaction(async (tx) => {
      // Criar o usuário
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashed,
          name,
          role,
          lastLogin: new Date(),
          // Criar as configurações do usuário automaticamente
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

    // Retorna os dados do usuário (sem incluir a senha)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
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
