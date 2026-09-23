export interface LocationLga {
    name: string;
}

export interface LocationCdsGroup {
    name: string;
}

// Fields visible to everyone, logged in or not.
export interface LocationPublic {
    id: number;
    name: string;
    address: string | null;
    capacity_notes: string | null;
    status: string | null;
    last_confirmed_at: string | null;
    lgas: LocationLga | null;
    cds_groups: LocationCdsGroup | null;
}

// Extra fields only selectable once logged in (contact info + signboard).
export interface LocationPrivate extends LocationPublic {
    contact_person: string | null;
    contact_phone: string | null;
    signboard_phone: string | null;
    signboard_image_path: string | null;
}

export type LocationDetail = LocationPublic | LocationPrivate;

// Narrows LocationDetail to LocationPrivate. Use this instead of a cast —
// it's driven by the same isLoggedIn flag the page already fetches with,
// so it's always correct rather than just asserted.
export function isPrivateLocation(
    location: LocationDetail,
    isLoggedIn: boolean
): location is LocationPrivate {
    return isLoggedIn;
}