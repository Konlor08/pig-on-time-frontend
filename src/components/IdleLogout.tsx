// src/components/IdleLogout.tsx
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

type Props = {
minutes?: number; // เวลาที่จะให้ออกอัตโนมัติ (ค่า default = 30 นาที)
};

export default function IdleLogout({ minutes = 30 }: Props) {
const IDLE_MS = minutes * 60 * 1000; // นาที -> มิลลิวินาที

useEffect(() => {
let timer: number | undefined;

const reset = () => {
if (timer) window.clearTimeout(timer);
timer = window.setTimeout(async () => {
await supabase.auth.signOut();
window.location.href = "/login"; // ส่งไปหน้า login
}, IDLE_MS);
};

// list ของ events ที่จะรีเซ็ตเวลาเมื่อ user ขยับ
const activityEvents = ["mousemove", "keydown", "click", "scroll"];

activityEvents.forEach((ev) => {
window.addEventListener(ev, reset);
});

// เริ่มจับเวลา
reset();

// cleanup เมื่อ component ถูก unmount
return () => {
if (timer) window.clearTimeout(timer);
activityEvents.forEach((ev) => {
window.removeEventListener(ev, reset);
});
};
}, [IDLE_MS]);

return null;
}