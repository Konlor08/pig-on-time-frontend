// src/components/ProfileForm.tsx
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../hooks/useAuth";

type Role = "user" | "driver" | "dispatcher" | "farm" | "admin";

export default function ProfileForm() {
const { session } = useAuth();
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [role, setRole] = useState<Role>("user");

const [loading, setLoading] = useState(true);
const [msg, setMsg] = useState<string | null>(null);
const [err, setErr] = useState<string | null>(null);

// โหลดโปรไฟล์จาก DB
useEffect(() => {
async function fetchProfile() {
try {
if (!session?.user?.id) return;
const { data, error } = await supabase
.from("profiles")
.select("full_name, phone, role")
.eq("id", session.user.id)
.single();

if (error) throw error;
if (data) {
setFullName(data.full_name ?? "");
setPhone(data.phone ?? "");
setRole((data.role as Role) ?? "user");
}
} catch (e: unknown) {
setErr(e instanceof Error ? e.message : "Failed to load profile.");
} finally {
setLoading(false);
}
}
fetchProfile();
}, [session?.user?.id]);

// บันทึกโปรไฟล์
const handleSave = async (e: FormEvent) => {
e.preventDefault();
setMsg(null);
setErr(null);

try {
if (!session?.user?.id) {
setErr("No session found. Please login again.");
return;
}

const updates = {
full_name: fullName || null,
phone: phone || null,
role,
updated_at: new Date(),
};

const { error } = await supabase
.from("profiles")
.update(updates)
.eq("id", session.user.id);

if (error) throw error;
setMsg("Profile updated successfully ✅");
} catch (e: unknown) {
setErr(e instanceof Error ? e.message : "Update failed.");
}
};

return (
<AuthLayout title="My Profile">
{loading ? (
<div>Loading...</div>
) : (
<form onSubmit={handleSave}>
<label style={label}>Full name</label>
<input
style={input}
type="text"
value={fullName}
onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
required
/>

<label style={label}>Phone</label>
<input
style={input}
type="tel"
value={phone}
onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
/>

<label style={label}>Role</label>
<select
style={input}
value={role}
onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as Role)}
>
<option value="user">User</option>
<option value="driver">Driver</option>
<option value="dispatcher">Dispatcher</option>
<option value="farm">Farm</option>
<option value="admin">Admin</option>
</select>

{err && <div style={errBox}>{err}</div>}
{msg && <div style={okBox}>{msg}</div>}

<button type="submit" style={btn}>
Save profile
</button>
</form>
)}
</AuthLayout>
);
}

/* ---------- inline styles ---------- */
const input: React.CSSProperties = {
display: "block",
width: "100%",
padding: "10px 12px",
marginBottom: "12px",
border: "1px solid #cbd5e1",
borderRadius: 10,
outline: "none",
fontSize: 16,
boxSizing: "border-box",
};

const label: React.CSSProperties = {
fontWeight: 600,
marginBottom: 4,
display: "block",
color: "#334155",
};

const btn: React.CSSProperties = {
width: "100%",
padding: "12px 16px",
marginTop: 8,
fontSize: 16,
fontWeight: 700,
color: "white",
background: "#2563eb",
border: "none",
borderRadius: 8,
cursor: "pointer",
};

const errBox: React.CSSProperties = {
color: "#991b1b",
background: "#fee2e2",
border: "1px solid #fecaca",
padding: "10px 12px",
borderRadius: 8,
marginTop: 6,
marginBottom: 6,
fontSize: 14,
};

const okBox: React.CSSProperties = {
color: "#14532d",
background: "#dcfce7",
border: "1px solid #bbf7d0",
padding: "10px 12px",
borderRadius: 8,
marginTop: 6,
marginBottom: 6,
fontSize: 14,
};
