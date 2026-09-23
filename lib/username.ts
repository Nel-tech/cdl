import type { SupabaseClient } from "@supabase/supabase-js";

// Turns "Nsit Ibom" + "Agro Allied" into "nsitibom-agroallied"
export function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "");
}

export function buildUsername(lgaName: string, cdsGroupName: string) {
    return `${slugify(lgaName)}-${slugify(cdsGroupName)}`;
}

// Supabase Auth requires an email for login. We generate a stable internal
// one from the username so users can log in with username + password,
// while their real email (for recovery) lives in cds_presidents.email.
export function internalAuthEmail(username: string) {
    return `${username}@cdsplatform.com`;
}

// Now that signup is open to everyone in a LGA+group (not just one
// exclusive president), buildUsername() alone WILL collide — e.g. two
// people in Nsit Ibom + Agro Allied both base out to
// "nsitibom-agroallied". This finds the next free variant by checking
// existing usernames and appending -2, -3, etc.
//
// Call this instead of buildUsername() directly at signup time.
export async function generateUniqueUsername(
    supabase: SupabaseClient,
    lgaName: string,
    cdsGroupName: string
): Promise<string> {
    const base = buildUsername(lgaName, cdsGroupName);

    const { data: existing, error } = await supabase
        .from("cds_presidents")
        .select("username")
        .like("username", `${base}%`);

    if (error) {
        // Fail safe: worst case is a duplicate-email error at signUp()
        // time, which the caller already handles and surfaces to the user.
        return base;
    }

    const taken = new Set((existing ?? []).map((row) => row.username as string));
    if (!taken.has(base)) return base;

    let suffix = 2;
    while (taken.has(`${base}-${suffix}`)) suffix++;
    return `${base}-${suffix}`;
}