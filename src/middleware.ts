import { NextRequest, NextResponse } from "next/server";
import { verify, decode } from "jsonwebtoken";

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
    // Primeiro tenta decodificar o token para ver se a estrutura está correta
    const decoded = decode(token);
    if (!decoded) {
      throw new Error("Token malformado");
    }

    const secret = process.env.JWT_SECRET ?? "default";

    console.log("Verificando token JWT com o segredo:", secret);

    verify(token, secret);

    return NextResponse.next();
  } catch {
    console.log("Token inválido ou expirado, redirecionando para login");
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
