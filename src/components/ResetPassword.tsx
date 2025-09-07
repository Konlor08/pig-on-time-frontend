import React, { useState, type FormEvent } from "react";
import { supabase } from "../supabaseClient";
import AuthLayout from "./AuthLayout";

export default function ResetPassword() {
const [email, setEmail] = useState("");
const [msg, setMsg] = useState<string | null>(null);
const [err, setErr] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const submit = async (e: FormEvent) => {
e.preventDefault();
setErr(null); setMsg(null); setLoading(true);
try {
const { error } = await supabase.auth.resetPasswordForEmail(email, {
redirectTo: `${window.location.origin}/login`,
});
if (error) { setErr(error.message); return; }
setMsg("If this email exists, a reset link has been sent.");
} catch (er: unknown) {
setErr(er instanceof Error ? er.message : "Unexpected error");
} finally {
setLoading(false);
}
};

const input: React.CSSProperties = {
display: "block", width: "100%", padding: "10px 12px",
marginBottom: "12px", border: "1px solid #cbd5e1", borderRadius: 10,
};
const label: React.CSSProperties = { fontWeight: 600, display: "block", marginBottom: 6 };

return (
<AuthLayout title="Reset password">
<form onSubmit={submit}>
<label style={label}>Email</label>
<input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
{err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}
{msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}
<button
type="submit" disabled={loading}
style={{
width: "100%", padding: "12px 16px", fontWeight: 700, color: "#fff",
background: loading ? "#60a5fa" : "#2563eb", border: "none", borderRadius: 8, cursor: "pointer"
}}
>
{loading ? "Sending..." : "Send reset link"}
</button>
</form>
</AuthLayout>
);
}
