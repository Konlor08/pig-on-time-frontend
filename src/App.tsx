// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// context / provider
import AuthProvider from "./context/AuthProvider";

// UI
import NavBar from "./components/NavBar";

// pages (ของคุณ)
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import ProfileForm from "./components/ProfileForm";

// guards
import RoleGate from "./components/RoleGate";

// เดโมหน้าเปล่า ๆ (คุณจะค่อย ๆ แทนของจริงภายหลัง)
function Dashboard() {
return (
<div style={{ padding: 24 }}>
<h1>Dashboard</h1>
<p>ยินดีต้อนรับสู่ระบบ Pig On Time</p>
</div>
);
}

export default function App() {
return (
<BrowserRouter>
<AuthProvider>
<NavBar />

<Routes>
{/* public */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/reset" element={<ResetPassword />} />

{/* กรอกโปรไฟล์ครั้งแรก */}
<Route path="/profile" element={<ProfileForm />} />

{/* user-facing: ต้องล็อกอินเท่านั้น */}
<Route
path="/dashboard"
element={
<RoleGate allow={["user", "driver", "dispatcher", "farm", "admin"]}>
<Dashboard />
</RoleGate>
}
/>

{/* default: ส่งไป dashboard (แล้ว RoleGate จะจัดการเอง) */}
<Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
</AuthProvider>
</BrowserRouter>
);
}
