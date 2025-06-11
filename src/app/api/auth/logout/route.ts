import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  try {
    // Obter token
    const accessToken = cookies().get("accessToken")?.value;

    if (accessToken) {
      // Decodificar token para obter userId (sem verificar validade)
      try {
        const secret = process.env.JWT_SECRET || "seu_secret_padrao";
        const secretUtf8 = new TextEncoder().encode(secret);

        await jose.jwtVerify(accessToken, secretUtf8);

        // Remover a sessão do banco de dados
        await prisma.session.deleteMany({
          where: { token: accessToken },
        });
      } catch (error) {
        // Token pode estar inválido, mas ainda queremos limpar os cookies
        console.log("Token inválido durante logout:", error);
      }
    }

    // Limpar todos os cookies de autenticação
    await cookies().delete("accessToken");
    await cookies().delete("refreshToken");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao processar logout" },
      { status: 500 }
    );
  }
}
