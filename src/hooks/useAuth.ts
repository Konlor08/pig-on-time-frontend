// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext, type AuthValue } from "../context/AuthContext";

export function useAuth(): AuthValue {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
return ctx;
}