import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se o usuário acessar a raiz, redirecionar para login
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Para todas as outras rotas, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
