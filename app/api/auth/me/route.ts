// app/api/auth/me/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { User } from "@/app/models/user";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // 1) ต่อ Mongo
    await dbConnect();

    // 2) ดึง token จาก Header
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    // 3) ถอดรหัส JWT
    const payload = verify(token, process.env.JWT_SECRET!) as { _id: string };

    // 4) หา user จากฐานข้อมูล
    const user = await User.findById(payload._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 5) ส่งคืนเฉพาะข้อมูลสาธารณะ (ไม่รวม passwordHash)
    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[ME_ERROR]", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
