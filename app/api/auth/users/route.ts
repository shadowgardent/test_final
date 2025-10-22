// app/api/users/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { User } from "@/app/models/user";

type SortDir = "asc" | "desc";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // ---- parse query ----
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
    const q = (searchParams.get("q") || "").trim();

    // sort parsing: "field:asc|desc"
    const sortParam = searchParams.get("sort") || "createdAt:desc";
    const [sortField, sortDirRaw] = sortParam.split(":");
    const sortDir: SortDir = (sortDirRaw === "asc" ? "asc" : "desc");

    const filter: any = {};
    if (q) {
      filter.$or = [
        { name:  { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // ---- query ----
    const [items, total] = await Promise.all([
      User.find(filter)
        .select("-passwordHash")               // 🔒 ซ่อน hash
        .sort({ [sortField]: sortDir === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      page,
      limit,
      total,
      pages,
      users: items.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        createdAt: new Date(u.createdAt).toISOString(),
        updatedAt: new Date(u.updatedAt).toISOString(),
      })),
    });
  } catch (err) {
    console.error("[USERS_LIST_ERROR]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
