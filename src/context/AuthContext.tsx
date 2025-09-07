// src/context/AuthContext.tsx
import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "../types";

export type AuthValue = {
session: Session | null;
profile: Profile | null;
loading: boolean;
signOut: () => Promise<void>;
};

// ประกาศ context พร้อม type ให้ชัดเจน
export const AuthContext = createContext<AuthValue | undefined>(undefined);