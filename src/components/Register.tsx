// src/components/Register.tsx
import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";

// ---- config / helpers ----
const ROLES = ["user", "driver", "dispatcher", "farm", "admin"] as const;
type Role = (typeof ROLES)[number];

function isValidEmail(v: string) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ---- styles ----
const pageWrap: React.CSSProperties = { padding: 24 };

const labelStyle: React.CSSProperties = {
fontWeight: 600,
display: "block",
marginBottom: 6,
};

const INPUT_H = 44;

const fieldWrap: React.CSSProperties = {
position: "relative",
marginBottom: 12,
minHeight: INPUT_H,
};

const inputStyle: React.CSSProperties = {
display: "block",
width: "100%",
height: INPUT_H,
padding: "10px 12px",
border: "1px solid #ccc",
borderRadius: 6,
fontSize: 14,
boxSizing: "border-box",
};

const passInputStyle: React.CSSProperties = {
...inputStyle,
// เผื่อช่องด้านขวาให้ปุ่ม Show
paddingRight: 110,
};

const showBtn: React.CSSProperties = {
position: "absolute" as const,
right: 8,
top: "50%",
transform: "translateY(-50%)",
height: INPUT_H - 8,
padding: "0 14px",
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
borderRadius: 6,
background: "#f3f4f6",
border: "1px solid #d1d5db",
cursor: "pointer",
userSelect: "none",
};

const selectStyle: React.CSSProperties = { ...inputStyle };

const submitStyle: React.CSSProperties = {
height: 48,
borderRadius: 8,
border: "none",
background: "#2563eb",
color: "white",
fontWeight: 700,
width: "100%",
cursor: "pointer",
marginTop: 8,
};

const okBox: React.CSSProperties = {
color: "white",
background: "#16a34a",
padding: "10px 12px",
borderRadius: 8,
marginBottom: 12,
};

const errBox: React.CSSProperties = {
color: "white",
background: "#dc2626",
padding: "10px 12px",
borderRadius: 8,
marginBottom: 12,
};

// ---- component ----
export default function Register() {
const [email, setEmail] = useState("");
const [pwd, setPwd] = useState("");
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [role, setRole] = useState<Role>("user");
const [showPwd, setShowPwd] = useState(false);
const [loading, setLoading] = useState(false);
const [ok, setOk] = useState<string | null>(null);
const [err, setErr] = useState<string | null>(null);

async function handleRegister(e: FormEvent<HTMLFormElement>) {
e.preventDefault();
setOk(null);
setErr(null);

// ตรวจความถูกต้องเบื้องต้น
if (!isValidEmail(email)) {
setErr("อีเมลไม่ถูกต้อง");
return;
}
if (pwd.length < 6) {
setErr("รหัสผ่านอย่างน้อย 6 ตัวอักษร");
return;
}

setLoading(true);
try {
// 1) สร้าง user (email/password)
const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
email,
password: pwd,
options: {
emailRedirectTo: undefined, // ไม่ใช้ redirect พิเศษ
data: { full_name: fullName, phone, role }, // metadata (ไม่บังคับ)
},
});
if (signUpErr) throw signUpErr;

const userId = signUpData.user?.id;
if (!userId) throw new Error("ไม่สามารถสร้างบัญชีผู้ใช้ได้");

// 2) บันทึกตาราง profiles (id = user.id)
const { error: upsertErr } = await supabase.from("profiles").upsert(
{
id: userId,
email,
full_name: fullName,
phone,
role,
},
{ onConflict: "id" }
);
if (upsertErr) throw upsertErr;

// 3) ถ้ายังไม่มี session ให้ sign in อัตโนมัติ
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
const { error: loginErr } = await supabase.auth.signInWithPassword({
email,
password: pwd,
});
if (loginErr) throw loginErr;
}

setOk("ลงทะเบียนสำเร็จ กำลังพาไปยังหน้า Dashboard…");
// 4) ไปหน้า dashboard
setTimeout(() => {
window.location.href = "/dashboard";
}, 600);
} catch (e) {
const msg =
e instanceof Error ? e.message : "Register failed. Please try again.";
setErr(msg);
} finally {
setLoading(false);
}
}

return (
<AuthLayout title="Create account">
<div style={pageWrap}>
{ok && <div style={okBox}>{ok}</div>}
{err && <div style={errBox}>{err}</div>}

<form onSubmit={handleRegister} noValidate>
{/* Email */}
<label style={labelStyle}>Email</label>
<div style={fieldWrap}>
<input
style={inputStyle}
type="email"
value={email}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setEmail(e.target.value)
}
placeholder="you@example.com"
autoComplete="email"
required
/>
</div>

{/* Password */}
<label style={labelStyle}>Password</label>
<div style={fieldWrap}>
<input
style={passInputStyle}
type={showPwd ? "text" : "password"}
value={pwd}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setPwd(e.target.value)
}
placeholder="อย่างน้อย 6 ตัวอักษร"
autoComplete="new-password"
required
/>
<button
type="button"
style={showBtn}
onClick={() => setShowPwd((v) => !v)}
>
{showPwd ? "Hide" : "Show"}
</button>
</div>

{/* Full name */}
<label style={labelStyle}>Full name</label>
<div style={fieldWrap}>
<input
style={inputStyle}
type="text"
value={fullName}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setFullName(e.target.value)
}
placeholder="ชื่อ-นามสกุล"
/>
</div>

{/* Phone */}
<label style={labelStyle}>Phone</label>
<div style={fieldWrap}>
<input
style={inputStyle}
type="tel"
value={phone}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setPhone(e.target.value)
}
placeholder="08xxxxxxxx"
/>
</div>

{/* Role */}
<label style={labelStyle}>Role</label>
<div style={fieldWrap}>
<select
style={selectStyle}
value={role}
onChange={(e: ChangeEvent<HTMLSelectElement>) =>
setRole(e.target.value as Role)
}
>
{ROLES.map((r) => (
<option key={r} value={r}>
{r.charAt(0).toUpperCase() + r.slice(1)}
</option>
))}
</select>
</div>

<button type="submit" style={submitStyle} disabled={loading}>
{loading ? "Registering..." : "Register"}
</button>
</form>
</div>
</AuthLayout>
);
}