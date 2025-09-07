import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = { children: ReactNode };

export default function AnonGate({ children }: Props) {
const { session, loading } = useAuth();
if (loading) return null; // รอโหลด session
if (session) return <Navigate to="/dashboard" replace />; // ถ้า login แล้ว ส่งไป dashboard
return <>{children}</>;
}