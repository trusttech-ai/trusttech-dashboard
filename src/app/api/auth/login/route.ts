import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
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
        { error: "Credenciais inválidas" },
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
    const secret = process.env.JWT_SECRET ?? "default";
    if (!secret) {
      return NextResponse.json(
        { error: "Erro de configuração no servidor" },
        { status: 500 }
      );
    }

    // Calculando a expiração com base no horário de Brasília (UTC-3)
    const now = Math.floor(Date.now() / 1000); // tempo atual em segundos
    const expiresIn = 3600; // 1 hora em segundos
    const expiresAt = now + expiresIn;

    const accessToken = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: now, // issued at - momento da emissão
        exp: expiresAt, // expiration time - momento da expiração
        tz: "America/Sao_Paulo", // identificador do fuso horário
      },
      secret
    );

    // Também ajustando o refreshToken para manter consistência
    const refreshExpiresAt = now + 7 * 24 * 60 * 60; // 7 dias em segundos
    const refreshToken = sign(
      {
        userId: user.id,
        iat: now,
        exp: refreshExpiresAt,
        tz: "America/Sao_Paulo",
      },
      secret
    );

    // Atualizando o objeto de data para a sessão no banco de dados
    const sessionExpiryDate = new Date(expiresAt * 1000);

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
    const ip = req.headers.get("x-forwarded-for") || req.ip || "";

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
      maxAge: expiresIn, // 1 hora em segundos
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
        settings: {
          theme: user.settings?.theme,
          emailNotifications: user.settings?.emailNotifications,
        },
      },
      accessToken,
    });
  } catch (err: any) {
    console.error("Erro ao fazer login:", err);

    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
