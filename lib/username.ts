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
// one from the username so presidents can log in with username + password,
// while their real email (for recovery) lives in cds_presidents.email.
export function internalAuthEmail(username: string) {
    return `${username}@cdsplatform.com`;
}