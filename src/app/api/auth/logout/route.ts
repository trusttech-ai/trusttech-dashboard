import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Obter token
    const accessToken = cookies().get("accessToken")?.value;
    
    if (accessToken) {
      // Decodificar token para obter userId (sem verificar validade)
      try {
        const secret = process.env.JWT_SECRET || "seu_secret_padrao";
        const decoded = verify(accessToken, secret) as { userId: number };
        
        // Remover a sessão do banco de dados
        await prisma.session.deleteMany({
          where: { token: accessToken }
        });
      } catch (error) {
        // Token pode estar inválido, mas ainda queremos limpar os cookies
        console.log("Token inválido durante logout:", error);
      }
    }
    
    // Limpar todos os cookies de autenticação
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao processar logout" },
      { status: 500 }
    );
  }
}