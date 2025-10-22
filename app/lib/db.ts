// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = global as unknown as { _mongoose: GlobalMongoose };

if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  const cached = globalForMongoose._mongoose;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "Tester" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
