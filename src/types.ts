export type Role = "admin" | "dispatcher" | "driver" | "farm" | "user";
export type Profile = {
id: string;
email: string | null;
full_name: string | null;
phone: string | null;
role: Role;
};