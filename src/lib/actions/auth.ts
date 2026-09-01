"use server";

import { redirect } from "next/navigation";

import { getAdminContext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string };

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase must be connected before administrators can sign in." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "The sign-in details could not be verified." };

  const admin = await getAdminContext();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for administration." };
  }

  const requestedPath = String(formData.get("next") ?? "/admin");
  const destination = requestedPath.startsWith("/admin") ? requestedPath : "/admin";
  redirect(destination);
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
