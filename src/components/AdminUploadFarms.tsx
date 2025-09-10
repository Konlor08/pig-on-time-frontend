// src/components/AdminUploadFarms.tsx
// หน้าสำหรับ Admin อัปโหลดรายชื่อฟาร์มจาก Excel/CSV เข้าตาราง farms_upload
// แล้วกด Merge เพื่อย้ายเข้า public.farms + สร้างความสัมพันธ์ตามที่กำหนด

import { useMemo, useState} from "react";
import type { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../supabaseClient";

type UploadRow = {
plant: string; // รหัสฟาร์มหลัก (PK ฝั่งธุรกิจ)
house: string | null; // โรงเรือน (อาจว่าง)
name: string; // ชื่อฟาร์ม/ชื่อเล่น
province: string | null;
amphur: string | null;
tambon: string | null;
};

type JsonRow = Record<string, string | number | boolean | null>;

const COLS = [
"plant",
"house",
"name",
"province",
"amphur",
"tambon",
] as const;
type ColKey = (typeof COLS)[number];

// label แสดงหัวคอลัมน์ในตารางตัวอย่าง
const COL_LABEL: Record<ColKey, string> = {
plant: "Plant (รหัสฟาร์ม)",
house: "House (โรงเรือน)",
name: "ชื่อฟาร์ม",
province: "จังหวัด",
amphur: "อำเภอ",
tambon: "ตำบล",
};

// map คำหัวคอลัมน์จากไฟล์ให้มาเป็นคีย์มาตรฐานของเรา
// เพิ่ม key ใหม่ได้ตามไฟล์ที่ใช้งานจริง
const HEADER_ALIAS: Record<string, ColKey> = {
plant: "plant",
code: "plant",
รหัสฟาร์ม: "plant",

house: "house",
โรงเรือน: "house",

name: "name",
ชื่อฟาร์ม: "name",
farmname: "name",

province: "province",
จังหวัด: "province",

amphur: "amphur",
อำเภอ: "amphur",
district: "amphur",

tambon: "tambon",
ตำบล: "tambon",
subdistrict: "tambon",
};

function normKey(s: string): string {
return s.toString().trim().toLowerCase().replace(/\s+|_/g, "");
}

function toColKey(raw: string): ColKey | null {
const k = normKey(raw);
// หา key ตรงใน alias (หลัง normalize)
const matched = Object.keys(HEADER_ALIAS).find((kk) => normKey(kk) === k);
return matched ? HEADER_ALIAS[matched] : null;
}

function valToStr(v: unknown): string {
if (v === null || v === undefined) return "";
return String(v).trim();
}

export default function AdminUploadFarms() {
const [rows, setRows] = useState<UploadRow[]>([]);
const [log, setLog] = useState<string[]>([]);
const [loadingUpload, setLoadingUpload] = useState(false);
const [loadingMerge, setLoadingMerge] = useState(false);
const [clearStaging, setClearStaging] = useState(true);

const canUpload = useMemo<boolean>(() => rows.length > 0, [rows]);

const appendLog = (msg: string) =>
setLog((ls) => [...ls, `${new Date().toLocaleTimeString()} • ${msg}`]);

const handleFile = async (file: File) => {
try {
setRows([]);
setLog([]);
appendLog(`อ่านไฟล์: ${file.name}`);

const buf = await file.arrayBuffer();
const wb = XLSX.read(buf, { type: "array" as const });
const wsName = wb.SheetNames[0];
const ws = wb.Sheets[wsName];

// แปลงเป็น JSON; ให้ค่าว่างเป็น "" เสมอ เพื่อง่ายต่อการ normalize
const raw: JsonRow[] = XLSX.utils.sheet_to_json<JsonRow>(ws, {
defval: "",
});

// ทำ header mapping + สร้าง UploadRow[]
const mapped: UploadRow[] = raw.map((r): UploadRow => {
const acc: Partial<UploadRow> = {};
Object.entries(r).forEach(([key, value]) => {
const col = toColKey(key);
if (!col) return;
const s = valToStr(value);
switch (col) {
case "plant":
acc.plant = s;
break;
case "house":
acc.house = s || null;
break;
case "name":
acc.name = s;
break;
case "province":
acc.province = s || null;
break;
case "amphur":
acc.amphur = s || null;
break;
case "tambon":
acc.tambon = s || null;
break;
}
});

// ค่า default บังคับ
return {
plant: acc.plant ?? "",
house: acc.house ?? null,
name: acc.name ?? "",
province: acc.province ?? null,
amphur: acc.amphur ?? null,
tambon: acc.tambon ?? null,
};
});

// กรองแถวที่ไม่มี plant หรือ name (ถือว่าไม่สมบูรณ์)
const cleaned = mapped.filter((r) => r.plant !== "" && r.name !== "");
appendLog(`อ่านข้อมูลได้ ${mapped.length} แถว, ใช้ได้ ${cleaned.length} แถว`);
setRows(cleaned);
} catch (e) {
appendLog(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${(e as Error).message}`);
}
};

const onSelectFile = (ev: ChangeEvent<HTMLInputElement>) => {
const f = ev.target.files?.[0];
if (f) void handleFile(f);
};

const doUpload = async () => {
if (!canUpload) return;
setLoadingUpload(true);
try {
appendLog("อัปโหลดขึ้นตาราง staging: public.farms_upload ...");

// upsert ด้วย onConflict plant,house (ตาม SQL ที่ตั้ง unique ไว้)
const { error } = await supabase
.from("farms_upload")
.upsert(rows, { onConflict: "plant,house" });

if (error) throw error;
appendLog(`อัปโหลดสำเร็จ: ${rows.length} แถว`);
} catch (e) {
appendLog(`อัปโหลดล้มเหลว: ${(e as Error).message}`);
} finally {
setLoadingUpload(false);
}
};

const doMerge = async () => {
setLoadingMerge(true);
try {
appendLog("กำลัง Merge จาก staging → public.farms ...");
const { data, error } = await supabase.rpc("merge_farms_from_upload", {
clear_staging: clearStaging,
});
if (error) throw error;
appendLog(`Merge สำเร็จ: upsert ${data as number} แถว`);
if (clearStaging) appendLog("ล้างตาราง staging (farms_upload) แล้ว");
} catch (e) {
appendLog(`Merge ล้มเหลว: ${(e as Error).message}`);
} finally {
setLoadingMerge(false);
}
};

return (
<div style={{ maxWidth: 1100, margin: "24px auto", padding: 16 }}>
<h2>Upload Farms (Admin)</h2>

<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
<input
type="file"
accept=".xlsx,.xls,.csv"
onChange={onSelectFile}
aria-label="เลือกไฟล์ Excel/CSV"
/>
<button
onClick={doUpload}
disabled={!canUpload || loadingUpload}
style={{ padding: "8px 16px" }}
>
{loadingUpload ? "Uploading..." : "Upload to Staging"}
</button>
<label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
<input
type="checkbox"
checked={clearStaging}
onChange={(e) => setClearStaging(e.target.checked)}
/>
เคลียร์ตาราง staging หลัง Merge
</label>
<button
onClick={doMerge}
disabled={loadingMerge}
style={{ padding: "8px 16px" }}
>
{loadingMerge ? "Merging..." : "Merge → Farms"}
</button>
</div>

{/* ตัวอย่างข้อมูล */}
<div style={{ marginTop: 16 }}>
<h3>ตัวอย่างข้อมูล (แสดง 20 แถวแรก)</h3>
{rows.length === 0 ? (
<div style={{ color: "#888" }}>ยังไม่มีข้อมูล แนะนำให้เลือกไฟล์</div>
) : (
<div
style={{
maxHeight: 420,
overflow: "auto",
border: "1px solid #eee",
borderRadius: 6,
}}
>
<table
style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
>
<thead>
<tr>
{COLS.map((c) => (
<th
key={c}
style={{
position: "sticky",
top: 0,
background: "#f7f7f7",
borderBottom: "1px solid #ddd",
textAlign: "left",
padding: "8px 10px",
}}
>
{COL_LABEL[c]}
</th>
))}
</tr>
</thead>
<tbody>
{rows.slice(0, 20).map((r, i) => (
<tr key={`${r.plant}-${r.house ?? ""}-${i}`}>
{COLS.map((c) => (
<td
key={c}
style={{ borderBottom: "1px solid #f0f0f0", padding: "6px 10px" }}
>
{r[c] ?? ""}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
)}
</div>

{/* Log */}
<div style={{ marginTop: 16 }}>
<h3>Log</h3>
<div
style={{
whiteSpace: "pre-wrap",
border: "1px solid #eee",
borderRadius: 6,
padding: 12,
minHeight: 120,
background: "#fafafa",
fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
fontSize: 13,
}}
>
{log.length === 0 ? "—" : log.join("\n")}
</div>
</div>
</div>
);
}
