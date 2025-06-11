import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"; // Biblioteca compatível com Edge Runtime

// Função para extrair o token do cookie
const getToken = (request: NextRequest) => {
  const token = request.cookies.get("accessToken")?.value;
  return token;
};

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/register", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore rotas públicas e rotas de API
  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = getToken(request);

  // Se não tem token, redireciona para login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não está definido no ambiente!");
      throw new Error("Configuração de segurança ausente");
    }

    const secretUtf8 = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretUtf8);

    console.log("Token verificado com sucesso:", payload);

    return NextResponse.next();
  } catch (error: any) {
    console.error("Erro na verificação do token:", error.message);
    console.log("Token inválido ou expirado, redirecionando para login");
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
