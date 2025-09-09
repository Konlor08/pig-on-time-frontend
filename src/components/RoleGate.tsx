// src/components/RoleGate.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types';

export default function RoleGate({
allow,
children,
}: {
allow: Role[];
children: React.ReactNode;
}) {
const { profile, loading } = useAuth();

if (loading) return null;
if (!profile) return <Navigate to="/login" replace />;

const ok = allow.includes((profile.role as Role) ?? 'driver');
if (!ok) return <Navigate to="/dashboard" replace />;

return <>{children}</>;
}