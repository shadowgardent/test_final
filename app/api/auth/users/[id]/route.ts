// app/api/auth/users/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/app/lib/db";
import { User } from "@/app/models/user";

const updateSchema = z.object({
  name: z.string().min(1, "name is required").optional(),
  email: z.string().email("invalid email").optional(),
  password: z.string().min(6, "password must be >= 6 chars").optional(),
});

function invalidIdResponse() {
  return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
}

type RouteParams = { id: string };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    await dbConnect();

    const { id: userId } = await params;
    if (!Types.ObjectId.isValid(userId)) {
      return invalidIdResponse();
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) {
      updates.name = parsed.data.name;
    }
    if (parsed.data.email !== undefined) {
      updates.email = parsed.data.email.toLowerCase();
    }
    if (parsed.data.password !== undefined) {
      updates.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }

    if (updates.email) {
      const conflict = await User.findOne({
        _id: { $ne: userId },
        email: updates.email,
      });
      if (conflict) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 409 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const publicUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { message: "User updated", user: publicUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("[USER_UPDATE_ERROR]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    await dbConnect();

    const { id: userId } = await params;
    if (!Types.ObjectId.isValid(userId)) {
      return invalidIdResponse();
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error("[USER_DELETE_ERROR]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
