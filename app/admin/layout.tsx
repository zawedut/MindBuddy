// app/admin/layout.tsx
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 🚨 ใส่รหัส Admin ตรงนี้
  // ****************
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_default_password'; // ต้องตั้งค่าใน .env

  if (typeof window !== 'undefined') {
    const storedPass = localStorage.getItem('admin_pass');

    if (storedPass !== ADMIN_PASSWORD) {
      let enteredPass = prompt("ใส่รหัสผ่านสำหรับ Admin Dashboard:");
      
      if (enteredPass !== ADMIN_PASSWORD) {
        alert("รหัสผ่านไม่ถูกต้อง! จะถูกนำไปหน้าหลัก");
        redirect('/'); // นำไปหน้าหลักถ้าใส่ผิด
        return null; // หยุดการเรนเดอร์
      }
      
      localStorage.setItem('admin_pass', enteredPass);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-teal-400">MindBuddy Admin Dashboard</h1>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}