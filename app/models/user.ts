// models/User.ts
import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name:   { type: String, required: true, trim: true },               // ชื่อ
    email:  { type: String, required: true, unique: true, lowercase: true, trim: true }, // อีเมล
    passwordHash: { type: String, required: true },                     // เก็บ hash เท่านั้น
  },
  { timestamps: true }
);

export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export const User = models.User || model<UserDoc>("User", UserSchema);
