// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { User } from "@/app/models/user";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { getJwtExpires } from "@/app/api/utils/jwt";

const schema = z.object({
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

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = sign(
  { _id: user._id.toString(), email: user.email },
  process.env.JWT_SECRET!,                 // แน่ใจว่ามีค่า
  { expiresIn: getJwtExpires() }           // ✅ ไม่พึ่งพา SignOptions
);

    const publicUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json({ message: "Logged in", user: publicUser, token }, { status: 200 });
  } catch (err) {
    console.error("[LOGIN_ERROR]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
