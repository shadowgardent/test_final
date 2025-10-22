// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { User } from "@/app/models/user";
import bcrypt from "bcryptjs";
import { z } from "zod";


const schema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("invalid email"),
  password: z.string().min(6, "password must be >= 6 chars"),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // กันอีเมลซ้ำ
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    // แฮชรหัสผ่าน
    const passwordHash = await bcrypt.hash(password, 10);

    const doc = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // ✅ สร้าง JWT (แก้จาก ".sign" เป็น "sign" และช่วย TS เรื่อง expiresIn)

    const user = {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };

    return NextResponse.json({ message: "Registered", user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
