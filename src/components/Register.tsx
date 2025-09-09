// src/components/Register.tsx
import React, { useState, type FormEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";
import { ROLES_FOR_SIGNUP, ROLE_LABEL, type Role } from "../types";

export default function Register() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [role, setRole] = useState<Role>("animal husbandry"); // default ตามที่ต้องการ
const [showPwd, setShowPwd] = useState(false);
const [loading, setLoading] = useState(false);
const [err, setErr] = useState<string | null>(null);

async function handleRegister(e: FormEvent) {
e.preventDefault();
setErr(null);
setLoading(true);

try {
// 1) สมัคร และคาดหวังว่าจะมี session ทันทีเพราะปิด confirm email แล้ว
const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
email,
password,
options: { emailRedirectTo: undefined }, // ไม่ต้อง redirect เพราะปิด confirm แล้ว
});
if (signUpErr) throw signUpErr;

// กัน edge case: ถ้าด้วยเหตุผลใดๆ session ยังไม่มา (ควรไม่เกิดหลังปิด confirm)
let session = signUpData.session;
if (!session) {
const { data: s2, error: s2Err } = await supabase.auth.signInWithPassword({
email,
password,
});
if (s2Err) throw s2Err;
session = s2.session;
}
const user = session!.user;

// 2) upsert โปรไฟล์ (ใช้ on conflict id)
const { error: upsertErr } = await supabase
.from("profiles")
.upsert(
{ id: user.id, email, full_name: fullName, phone, role },
{ onConflict: "id" }
);
if (upsertErr) throw upsertErr;

// 3) ไป dashboard
window.location.href = "/dashboard";
} catch (e) {
const msg =
e instanceof Error ? e.message : "Register failed. Please try again.";
setErr(msg);
} finally {
setLoading(false);
}
}

// ——— UI (ตำแหน่งปุ่ม Show ติดขอบขวาไม่ลอย) ———
const pwdWrap: React.CSSProperties = { position: "relative" };
const showBtn: React.CSSProperties = {
position: "absolute",
right: 8,
top: "50%",
transform: "translateY(-50%)",
padding: "4px 10px",
borderRadius: 6,
border: "1px solid #d1d5db",
background: "#f3f4f6",
cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
display: "block",
width: "100%",
padding: "10px",
marginBottom: "12px",
border: "1px solid #ccc",
borderRadius: 6,
fontSize: 14,
};

const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 600 };

return (
<AuthLayout title="Create account">
{err && (
<div style={{ background: "#dc2626", color: "white", padding: "10px 12px", borderRadius: 8, marginBottom: 12 }}>
{err}
</div>
)}

<form onSubmit={handleRegister}>
<label style={labelStyle}>Email</label>
<input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />

<label style={labelStyle}>Password</label>
<div style={pwdWrap}>
<input
style={{ ...inputStyle, marginBottom: 0 }}
type={showPwd ? "text" : "password"}
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="อย่างน้อย 6 ตัวอักษร"
required
/>
<button type="button" style={showBtn} onClick={() => setShowPwd((v) => !v)}>
{showPwd ? "Hide" : "Show"}
</button>
</div>
<div style={{ height: 12 }} />

<label style={labelStyle}>Full name</label>
<input style={inputStyle} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ชื่อ-นามสกุล" />

<label style={labelStyle}>Phone</label>
<input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxx" />

<label style={labelStyle}>Role</label>
<select
style={inputStyle}
value={role}
onChange={(e) => setRole(e.target.value as Role)}
>
{ROLES_FOR_SIGNUP.map((r) => (
<option key={r} value={r}>
{ROLE_LABEL[r]}
</option>
))}
</select>

<button
type="submit"
disabled={loading}
style={{
width: "100%",
padding: "12px 16px",
borderRadius: 8,
background: "#2563eb",
color: "white",
fontWeight: 700,
border: "none",
cursor: "pointer",
}}
>
{loading ? "Registering..." : "Register"}
</button>
</form>
</AuthLayout>
);
}
