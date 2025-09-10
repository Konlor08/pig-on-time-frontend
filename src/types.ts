// src/types.ts

// Enum Role ต้องตรงกับ Supabase ENUM: role_type
export type Role =
| 'animal_husbandry'
| 'shipper'
| 'planning'
| 'manager'
| 'driver'
| 'factory'
| 'admin'; // admin ใช้เฉพาะ server/service role

// Label สำหรับแสดงใน UI
export const ROLE_LABEL: Record<Role, string> = {
admin: 'Admin',
animal_husbandry: 'Animal Husbandry',
shipper: 'Shipper',
planning: 'Planning',
manager: 'Manager',
driver: 'Driver',
factory: 'Factory',
};

// Role ที่อนุญาตให้เลือกตอนสมัคร (exclude admin)
export const ROLES_FOR_SIGNUP: Role[] = [
'animal_husbandry',
'shipper',
'planning',
'manager',
'driver',
'factory',
];

// Profile interface ให้ตรงกับ table public.profiles
export interface Profile {
id: string;
email: string;
full_name: string | null;
phone: string | null;
role: Role;
created_at: string;
updated_at: string;
}