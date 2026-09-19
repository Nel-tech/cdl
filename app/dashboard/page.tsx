import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: president } = await supabase
        .from("cds_presidents")
        .select("id, lga_id, cds_group_id, full_name, is_verified")
        .eq("auth_user_id", user.id)
        .single();

    if (!president) redirect("/login");

    if (!president.is_verified) {
        return (
            <div className="min-h-screen bg-paper">
                <Header />
                <div className="max-w-md mx-auto px-6 py-10 text-sm text-[#5c5942]">
                    Your account is still pending verification. Check back soon.
                </div>
            </div>
        );
    }

    const { data: locations } = await supabase
        .from("locations")
        .select("id, name, address, contact_person, contact_phone, signboard_image_path, capacity_notes, status, last_confirmed_at")
        .eq("lga_id", president.lga_id)
        .eq("cds_group_id", president.cds_group_id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-paper">
            <Header />
            <DashboardClient president={president} initialLocations={locations ?? []} />
        </div>
    );
}