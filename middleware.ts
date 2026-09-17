import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/dashboard"];
const PENDING_ROUTE = "/signup/pending";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({ request });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options) {
                    request.cookies.set({ name, value: "", ...options });
                    response = NextResponse.next({ request });
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Gate: /dashboard requires an authenticated session
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtected && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect: already-verified presidents skip the pending page entirely
    if (pathname === PENDING_ROUTE && user) {
        const { data: president } = await supabase
            .from("cds_presidents")
            .select("is_verified")
            .eq("auth_user_id", user.id)
            .single();

        if (president?.is_verified) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*", "/signup/pending"],
};