import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function NavBar() {
const { session, signOut } = useAuth();

return (
<header
style={{
position: "sticky",
top: 0,
zIndex: 10,
height: 56,
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "0 16px",
background: "white",
borderBottom: "1px solid #e5e7eb",
}}
>
<Link to="/dashboard" style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none" }}>
<img src="/logo.png" alt="Pig On Time" width={20} height={20} />
<b style={{ color: "#111827" }}>Pig On Time</b>
</Link>

{!session ? (
<nav style={{ display: "flex", gap: 16 }}>
<Link to="/login">Login</Link>
<Link to="/register">Register</Link>
<Link to="/reset">Reset</Link>
</nav>
) : (
<nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
<Link to="/dashboard">Dashboard</Link>
<button
onClick={signOut}
style={{ border: "none", background: "transparent", cursor: "pointer", color: "#2563eb" }}
>
Logout
</button>
</nav>
)}
</header>
);
}
