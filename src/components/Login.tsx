// src/components/Login.tsx
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPwd, setShowPwd] = useState(false);
const [remember, setRemember] = useState(true);
const [loading, setLoading] = useState(false);
const [err, setErr] = useState<string | null>(null);

// ดึง email ที่เคย remember
useEffect(() => {
const saved = localStorage.getItem("pot_email");
if (saved) setEmail(saved);
}, []);

// handle login
const handleLogin = async (e: FormEvent) => {
e.preventDefault();
setLoading(true);
setErr(null);

const { error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) {
setErr(error.message);
} else {
if (remember) {
localStorage.setItem("pot_email", email);
} else {
localStorage.removeItem("pot_email");
}
}
setLoading(false);
};

return (
<AuthLayout title="Sign in">
<form onSubmit={handleLogin}>
<label style={label}>Email</label>
<input
type="email"
value={email}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setEmail(e.target.value)
}
required
style={input}
/>

<label style={label}>Password</label>
<div style={{ position: "relative", width: "100%" }}>
<input
type={showPwd ? "text" : "password"}
value={password}
onChange={(e: ChangeEvent<HTMLInputElement>) =>
setPassword(e.target.value)
}
required
autoComplete="current-password"
placeholder="••••••••"
style={{ ...input, paddingRight: 88 }} // เผื่อที่ให้ปุ่ม Show
/>
<button
type="button"
onClick={() => setShowPwd((s) => !s)}
style={showBtn}
>
{showPwd ? "Hide" : "Show"}
</button>
</div>

<label style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
<input
type="checkbox"
checked={remember}
onChange={(e) => setRemember(e.target.checked)}
style={{ marginRight: 8 }}
/>
Remember me
</label>

{err && <div style={errBox}>{err}</div>}

<button type="submit" style={btn} disabled={loading}>
{loading ? "Loading..." : "Login"}
</button>
</form>
</AuthLayout>
);
}

// -------- styles --------
const input: React.CSSProperties = {
display: "block",
width: "100%",
padding: "10px 12px",
marginBottom: 12,
border: "1px solid #cbd5e1",
borderRadius: 10,
fontSize: 16,
boxSizing: "border-box",
};

const label: React.CSSProperties = {
fontWeight: 600,
marginBottom: 4,
display: "block",
};

const showBtn: React.CSSProperties = {
position: "absolute",
right: 8,
top: "50%",
transform: "translateY(-50%)",
padding: "6px 10px",
borderRadius: 8,
border: "1px solid #cbd5e1",
background: "#f8fafc",
fontSize: 12,
cursor: "pointer",
};

const btn: React.CSSProperties = {
width: "100%",
padding: "10px 16px",
background: "#2563eb",
color: "white",
fontWeight: 600,
fontSize: 16,
border: "none",
borderRadius: 10,
cursor: "pointer",
};

const errBox: React.CSSProperties = {
color: "red",
marginBottom: 12,
};