import AuthLayout from "./AuthLayout";

export default function Dashboard() {
return (
<AuthLayout title="Dashboard">
<div style={{ fontSize: 16, lineHeight: 1.6 }}>
ยินดีต้อนรับสู่ระบบ Pig On Time 🎉<br/>
(หน้านี้เป็น placeholder — ไว้เชื่อมต่อเมนูตาม role ต่อไป)
</div>
</AuthLayout>
);
}