// src/context/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import type { Profile } from "../types";
import { AuthContext, type AuthValue } from "./AuthContext";

type Props = { children: ReactNode };

export default function AuthProvider({ children }: Props) {
const [session, setSession] = useState<Session | null>(null);
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState(true);

// 1) โหลด session ครั้งแรก + subscribe การเปลี่ยนแปลง auth
useEffect(() => {
// get current session
supabase.auth.getSession().then(({ data }) => {
setSession(data.session ?? null);
});

// subscribe auth state changes
const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
setSession(sess);
});

// cleanup
return () => {
sub.subscription.unsubscribe();
};
}, []);

// 2) โหลดโปรไฟล์เมื่อมี session (หรือ user เปลี่ยน)
useEffect(() => {
async function fetchProfile(userId: string) {
setLoading(true);
const { data, error } = await supabase
.from("profiles")
.select("id, email, full_name, phone, role")
.eq("id", userId)
.maybeSingle();

if (error) {
console.error("[profiles] fetch error:", error.message);
setProfile(null);
} else {
setProfile((data as Profile) ?? null);
}
setLoading(false);
}

const uid = session?.user?.id;
if (uid) {
fetchProfile(uid);
} else {
// ไม่มี session -> เคลียร์โปรไฟล์และหยุดโหลด
setProfile(null);
setLoading(false);
}
}, [session?.user?.id]);

// 3) signOut
const signOut: AuthValue["signOut"] = async () => {
await supabase.auth.signOut();
};

const value: AuthValue = { session, profile, loading, signOut };

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
