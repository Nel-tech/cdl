

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service "; // your service-role helper

export async function POST(req: NextRequest) {
    const body = await req.json();

    const {
        lga_id,
        cds_group_id,
        name,
        address,
        capacity_notes, // or `notes`, after your rename
        signboard_phone,
        contact_person,
        contact_phone,
        submitted_by_name,
        submitted_by_phone,
    } = body ?? {};

    // Minimal required-field validation. Keep this generous — the whole
    // point of the public path is a low-friction submission; a president
    // or admin fills in gaps on review, not the submitter up front.
    if (!lga_id || !cds_group_id || !name) {
        return NextResponse.json(
            { error: "lga_id, cds_group_id, and name are required." },
            { status: 400 }
        );
    }

    // Simple abuse guard: cap free-text field lengths. Rate limiting per
    // IP is worth adding at the edge/middleware level if spam becomes a
    // problem — not included here since it needs infra you may not have yet.
    const tooLong = [name, address, capacity_notes, contact_person].some(
        (v) => typeof v === "string" && v.length > 500
    );
    if (tooLong) {
        return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from("locations")
        .insert({
            lga_id,
            cds_group_id,
            name,
            address: address ?? null,
            capacity_notes: capacity_notes ?? null,
            signboard_phone: signboard_phone ?? null,
            contact_person: contact_person ?? null,
            contact_phone: contact_phone ?? null,
            submitted_by_name: submitted_by_name ?? null,
            submitted_by_phone: submitted_by_phone ?? null,
            submission_status: "pending",
        })
        .select("id")
        .single();

    if (error) {
        console.error("Public location submission failed:", error);
        return NextResponse.json({ error: "Could not submit location." }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, status: "pending" }, { status: 201 });
}