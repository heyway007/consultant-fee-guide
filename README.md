# คู่มือเทียบราคาค่าจ้างที่ปรึกษา ว16

เว็บ Next.js แบบอ่านอย่างเดียวสำหรับค้นหาและเปิดดูตารางอัตราเงินเดือนพื้นฐานของ 10 กลุ่มวิชาชีพ พร้อม Markup Factor ที่เกี่ยวข้อง

## มุมมองการใช้งาน

- แถบค้นหาและ Filter อยู่ด้านบนของหน้าเสมอ
- แท็บด้านล่างมีตัวเลือก “ทุกกลุ่มวิชาชีพ” และแท็บแยกของแต่ละกลุ่ม โดยเปิดตารางทั้งหมดของมุมมองที่เลือกเมื่อยังไม่มีเงื่อนไขค้นหา
- เมื่อกรอกคำค้นหรือเลือก Filter ระบบจะแสดงผลลัพธ์จากทุกกลุ่ม
- ระดับปริญญาที่เลือกจะถูกเน้นในตาราง แต่ยังคงแสดงราคาอีกสองระดับเพื่อเปรียบเทียบ
- แถวข้อมูลและ Markup Factor เก็บเลขหน้า/ชื่อตารางต้นทางเมื่อมีข้อมูลจริง

## เริ่มต้นใช้งาน

```powershell
npm install
npm run dev
```

เปิด `http://localhost:3000`

เว็บใช้ข้อมูลจากไฟล์ JSON ในโฟลเดอร์ `data/` โดยตรง ไม่ต้องตั้งค่าฐานข้อมูลหรือ environment variable เพิ่มเติม

## Build บน Cloudflare Workers

โปรเจกต์เตรียม OpenNext และ Wrangler สำหรับ Cloudflare Workers ไว้แล้ว โดยใช้คำสั่ง:

```powershell
npm run build:cloudflare
npm run preview:cloudflare
```

สำหรับ Cloudflare Workers Builds ต้องกำหนดคำสั่งแยกกันดังนี้:

```text
Build command:  npm run build:cloudflare
Deploy command: npm run deploy:cloudflare
```

อย่าใช้ Deploy command ค่าเริ่มต้น `npx wrangler deploy` เพราะ OpenNext ต้องเตรียมและ deploy output ผ่าน `opennextjs-cloudflare` เอง ระบบจะอ่านการตั้งค่าจาก `wrangler.jsonc` และใช้ output ใน `.open-next/` สำหรับ Worker

ถ้าต้องการ build และ deploy จากเครื่องในคำสั่งเดียว ให้ใช้:

```powershell
npm run release:cloudflare
```

## ตรวจสอบโปรเจ็กต์

```powershell
npm test
npm run lint
npm run build
```

ข้อมูลใน `data/` ถอดจากตาราง ว16 ครบทุกแถวแล้ว โดยคง `source_page` และ `source_table` ไว้ทุกระเบียน
