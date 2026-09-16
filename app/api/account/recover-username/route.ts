import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data } = await supabase
        .from("cds_presidents")
        .select("username")
        .eq("email", email.trim().toLowerCase())
        .single();

    if (!data) {
        return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
    }

    return NextResponse.json({ username: data.username });
}