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
  if (error) {
    console.error("[admin-auth] Supabase sign-in rejected", {
      code: error.code ?? "unknown",
      status: error.status ?? "unknown",
    });

    if (error.code === "email_not_confirmed") {
      return { error: "Supabase has not confirmed this administrator email yet." };
    }

    if (error.code === "invalid_credentials") {
      return { error: "Supabase rejected this email and password combination." };
    }

    if (error.code === "weak_password") {
      return { error: "Supabase rejected this password under the current password policy." };
    }

    return { error: `Supabase sign-in failed (${error.code ?? "unknown"}).` };
  }

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
