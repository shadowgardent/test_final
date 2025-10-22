"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  name?: string;
  email?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");

    if (!token || !userInfo) {
      router.replace("/FRONT/login");
      setIsChecking(false);
      return;
    }

    try {
      const parsed: StoredUser = JSON.parse(userInfo);
      setUser(parsed);
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
      router.replace("/FRONT/login");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/FRONT/login");
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
        <span className="text-white text-lg font-medium">กำลังโหลด...</span>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
      <section className="w-full max-w-xl rounded-3xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur-md space-y-6">
        <h1 className="text-4xl font-bold text-indigo-700">
          สวัสดี {user.name ?? "ผู้ใช้"}
        </h1>
        <p className="text-gray-700 text-lg">คุณได้เข้าสู่ระบบสำเร็จแล้ว</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold transition hover:bg-indigo-700"
        >
          ออกจากระบบ
        </button>
      </section>
    </main>
  );
}
