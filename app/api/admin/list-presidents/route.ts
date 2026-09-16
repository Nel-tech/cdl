import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from("cds_presidents")
        .select("id, auth_user_id, username, full_name, email, is_verified, lgas(name), cds_groups(name)")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ presidents: data });
}