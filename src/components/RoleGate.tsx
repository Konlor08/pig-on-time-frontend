import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
allow: Array<"admin" | "dispatcher" | "driver" | "farm" | "user">;
children: React.ReactNode;
};

export default function RoleGate({ allow, children }: Props) {
const { session, profile, loading } = useAuth();

if (loading) return null; // รอเช็ค session ก่อน
if (!session) return <Navigate to="/login" replace />;

const role = profile?.role ?? "user";
if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;

return <>{children}</>;
}