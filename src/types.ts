// src/types.ts

// 1) type ของบทบาททั้งหมดในระบบ (คง admin ไว้ แต่จะไม่ให้เลือกตอนสมัคร)
export type Role =
| 'animal_husbandry'
| 'shipper'
| 'planning'
| 'manager'
| 'driver'
| 'factory'
| 'admin';

// 2) ป้ายชื่อสำหรับแสดงผล (ให้ครบทุก role รวม admin)
export const ROLE_LABEL: Record<Role, string> = {
animal_husbandry: 'Animal Husbandry',
shipper: 'Shipper',
planning: 'Planning',
manager: 'Manager',
driver: 'Driver',
factory: 'Factory',
admin: 'Admin',
};

// 3) รายการ role ที่ “อนุญาตให้เลือกตอนสมัคร” (ตัด admin ออก)
export const ROLES_FOR_SIGNUP: Exclude<Role, 'admin'>[] = [
'animal_husbandry',
'shipper',
'planning',
'manager',
'driver',
'factory',
];

// 4) โครงสร้างข้อมูลโปรไฟล์ (ถ้าใช้)
export interface Profile {
id: string;
email: string | null;
full_name: string | null;
phone: string | null;
role: Role; // อนุญาตให้ admin ได้ (ตั้งจาก DB ภายหลัง)
created_at: string; // หรือ Date ถ้าแปลงแล้ว
}
