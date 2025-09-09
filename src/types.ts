// src/types.ts
export type Role =
| 'admin'
| 'animal_husbandry'
| 'shipper'
| 'planning'
| 'manager'
| 'driver'
| 'factory';

export const ROLE_LABEL: Record<Role, string> = {
admin: 'Admin',
animal_husbandry: 'Animal Husbandry',
shipper: 'Shipper',
planning: 'Planning',
manager: 'Manager',
driver: 'Driver',
factory: 'Factory',
};

// ใช้ในจอ Register (ตัด admin ออก)
export const ROLES_FOR_SIGNUP: Role[] = [
'animal_husbandry',
'shipper',
'planning',
'manager',
'driver',
'factory',
];

export interface Profile {
id: string;
email: string | null;
full_name: string | null;
phone: string | null;
role: Role;
created_at?: string;
}