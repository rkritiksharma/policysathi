"use server";

import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData): Promise<ActionResult> {
    const { supabase, user } = await getAuthenticatedUser();

    const agency_name = formData.get("agency_name") as string;
    const phone = formData.get("phone") as string;
    const irda_code = formData.get("irda_code") as string;
    const address = formData.get("address") as string;

    if (!agency_name || !phone) {
        return { error: "Agency name and phone number are required." };
    }

    const { error } = await supabase
        .from("agents")
        .update({
            agency_name,
            phone,
            irda_code,
            address,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to save profile. Please try again." };
    }

    // Return success to let the client handle the redirect
    return { data: true };
}
