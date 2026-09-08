import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const { id, auth_user_id, newFullName, newEmail, newPassword, password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update the auth user's password (username/login email stays the same)
    const { error: authErr } = await supabase.auth.admin.updateUserById(auth_user_id, {
        password: newPassword,
    });
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });

    // Update the profile row with the new person's details
    const { error: profileErr } = await supabase
        .from("cds_presidents")
        .update({ full_name: newFullName, email: newEmail })
        .eq("id", id);

    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}