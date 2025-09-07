import type { ReactNode } from "react";

type Props = {
title?: string;
children: ReactNode;
};

export default function AuthLayout({ title = "Pig On Time", children }: Props) {
return (
<div
style={{
minHeight: "100vh",
background: "#f5f7fb",
display: "flex",
flexDirection: "column",
}}
>
{/* เฮดเดอร์ใช้จาก NavBar แล้ว (อย่าให้ element อื่นทับ) */}
<main style={{ padding: 16, maxWidth: 960, margin: "16px auto 48px" }}>
<div
style={{
maxWidth: 560,
margin: "0 auto",
background: "white",
borderRadius: 12,
padding: 24,
boxShadow: "0 8px 24px rgba(0,0,0,.06)",
}}
>
{title && <h1 style={{ marginTop: 0 }}>{title}</h1>}
{children}
</div>
</main>
</div>
);
}
