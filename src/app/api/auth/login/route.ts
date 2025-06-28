import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Valida os dados obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { settings: true },
    });

    // Verifica se o usuário existe
    if (!user) {
      return NextResponse.json(
        { error: "Usuário Inexistente" },
        { status: 401 }
      );
    }

    // Verifica se o usuário está ativo
    if (!user.isActive) {
      return NextResponse.json({ error: "Conta desativada" }, { status: 403 });
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gera tokens JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const accessToken = await new jose.SignJWT({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const refreshToken = await new jose.SignJWT({
      sub: String(user.id),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // Atualizando o objeto de data para a sessão no banco de dados
    const sessionExpiryDate = new Date(Date.now() + 3600 * 1000);

    // Atualiza o último login e o refreshToken do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        refreshToken,
      },
    });

    // Cria uma nova sessão
    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for") || "";

    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: sessionExpiryDate,
        ipAddress: String(ip).split(",")[0].trim(),
        userAgent,
      },
    });

    // Define o token nos cookies
    (await cookies()).set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hora em segundos
      path: "/",
    });

    (await cookies()).set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
      path: "/",
    });

    // Retorna os dados do usuário (sem incluir dados sensíveis)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        settings: {
          theme: user.settings?.theme,
          emailNotifications: user.settings?.emailNotifications,
        },
      },
      accessToken,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro ao fazer login:", err);

    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
