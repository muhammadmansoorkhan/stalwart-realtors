import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  userId: string;
  email: string;
  displayName: string | null;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id, display_name, is_active")
    .eq("user_id", userData.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) return null;

  return {
    userId: userData.user.id,
    email: userData.user.email ?? "Administrator",
    displayName: admin.display_name,
  };
}

export async function requireAdmin() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");
  return admin;
}
