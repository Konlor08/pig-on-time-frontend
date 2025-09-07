
import type  { ReactNode } from "react";

type Props = {
title: string;
children: ReactNode;
};

export default function AuthLayout({ title, children }: Props) {
return (
<div
style={{
minHeight: "100vh",
background: "#f5f7fb",
display: "flex",
flexDirection: "column",
}}
>
{/* Top bar */}
<header
style={{
height: 56,
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "0 16px",
background: "white",
borderBottom: "1px solid #e5e7eb",
}}
>
<a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
<img src="/logo.png" alt="Pig On Time" height={28} />
<span style={{ fontWeight: 700, color: "#111827" }}>Pig On Time</span>
</a>
<nav style={{ display: "flex", gap: 16 }}>
<a href="/login" style={{ color: "#2563eb", textDecoration: "none" }}>Login</a>
<a href="/register" style={{ color: "#2563eb", textDecoration: "none" }}>Register</a>
<a href="/reset" style={{ color: "#2563eb", textDecoration: "none" }}>Reset</a>
</nav>
</header>

{/* Main */}
<main
style={{
flex: 1,
display: "flex",
justifyContent: "center",
alignItems: "flex-start",
padding: "40px 16px",
}}
>
<div
style={{
width: "100%",
maxWidth: 520,
background: "white",
padding: 24,
borderRadius: 12,
boxShadow: "0 8px 24px rgba(0,0,0,.08)",
}}
>
<h1 style={{ textAlign: "center", margin: "0 0 20px" }}>{title}</h1>
{children}
</div>
</main>
</div>
);
}