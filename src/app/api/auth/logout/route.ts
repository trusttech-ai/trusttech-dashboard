import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose";

import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Obter token
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (accessToken) {
      // Decodificar token para obter userId (sem verificar validade)
      try {
        // Verificamos se conseguimos decodificar o token para obter o userId
        const decoded = jose.decodeJwt(accessToken);
        const userId = decoded.sub; // subject contém o userId

        if (userId) {
          // Remover a sessão do banco de dados
          await prisma.session.deleteMany({
            where: { token: accessToken },
          });

          // Opcional: Remover o refresh token do usuário
          await prisma.user.update({
            where: { id: Number(userId) },
            data: { refreshToken: null },
          });
        }
      } catch (error) {
        // Token pode estar inválido, mas ainda queremos limpar os cookies
        console.log("Token inválido durante logout:", error);
      }
    }

    // Limpar todos os cookies de autenticação
    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao processar logout" },
      { status: 500 }
    );
  }
}
