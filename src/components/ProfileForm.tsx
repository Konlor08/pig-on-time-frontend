// src/components/ProfileForm.tsx
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../hooks/useAuth";

// 👉 นำเข้าชนิดและคงที่ที่ถูกต้อง
import { type Role, ROLE_LABEL, ROLES_FOR_SIGNUP } from "../types";

export default function ProfileForm() {
const { session } = useAuth();

const [fullName, setFullName] = useState<string>("");
const [phone, setPhone] = useState<string>("");
// default ให้ role เป็น animal_husbandry ตามที่ต้องการ
const [role, setRole] = useState<Role>("animal_husbandry");

const [loading, setLoading] = useState(true);
const [msg, setMsg] = useState<string | null>(null);
const [err, setErr] = useState<string | null>(null);

// โหลดโปรไฟล์
useEffect(() => {
async function fetchProfile() {
try {
if (!session?.user?.id) return;
const { data, error } = await supabase
.from("profiles")
.select("full_name, phone, role")
.eq("id", session.user.id)
.maybeSingle();

if (error) throw error;

if (data) {
setFullName(data.full_name ?? "");
setPhone(data.phone ?? "");
if (data.role) setRole(data.role as Role);
}
} catch (e: unknown) {
setErr(e instanceof Error ? e.message : "Load profile failed");
} finally {
setLoading(false);
}
}
fetchProfile();
}, [session?.user?.id]);

// บันทึกโปรไฟล์
async function handleSubmit(e: FormEvent) {
e.preventDefault();
setErr(null);
setMsg(null);
try {
if (!session?.user?.id) throw new Error("No user session");

const payload = {
id: session.user.id,
email: session.user.email,
full_name: fullName,
phone,
role,
};

const { error } = await supabase.from("profiles").upsert(payload, {
onConflict: "id",
});
if (error) throw error;

setMsg("Saved successfully");
} catch (e: unknown) {
setErr(e instanceof Error ? e.message : "Save failed");
}
}

if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

const inputStyle: React.CSSProperties = {
display: "block",
width: "100%",
padding: "10px",
marginBottom: "12px",
border: "1px solid #ccc",
borderRadius: 6,
fontSize: 14,
};
const labelStyle: React.CSSProperties = {
fontWeight: 600,
display: "block",
marginBottom: 6,
};
const submitStyle: React.CSSProperties = {
width: "100%",
padding: "12px 16px",
borderRadius: 8,
border: "none",
color: "white",
background: "#2563eb",
cursor: "pointer",
fontSize: 16,
};
const errBoxStyle: React.CSSProperties = {
color: "white",
background: "#dc2626",
padding: "10px 12px",
borderRadius: 8,
marginBottom: 12,
};
const okBoxStyle: React.CSSProperties = {
color: "#065f46",
background: "#d1fae5",
padding: "10px 12px",
borderRadius: 8,
marginBottom: 12,
border: "1px solid #10b981",
};

return (
<AuthLayout title="Profile">
<form onSubmit={handleSubmit}>
{err && <div style={errBoxStyle}>{err}</div>}
{msg && <div style={okBoxStyle}>{msg}</div>}

<label style={labelStyle}>Full name</label>
<input
style={inputStyle}
value={fullName}
onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
placeholder="ชื่อ-นามสกุล"
/>

<label style={labelStyle}>Phone</label>
<input
style={inputStyle}
value={phone}
onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
placeholder="08xxxxxxxx"
/>

<label style={labelStyle}>Role</label>
<select
style={inputStyle}
value={role}
onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as Role)}
>
{/* ✅ ใช้ ROLES_FOR_SIGNUP และกำหนดชนิด r: Role */}
{ROLES_FOR_SIGNUP.map((r: Role) => (
<option key={r} value={r}>
{ROLE_LABEL[r]}
</option>
))}
</select>

<button type="submit" style={submitStyle}>
Save
</button>
</form>
</AuthLayout>
);
}
