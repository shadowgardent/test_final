// types/auth.ts
export type RegisterBody = {
  name: string;     // ชื่อ
  email: string;    // อีเมล
  password: string; // รหัสผ่าน (plain จาก client)
};

export type LoginBody = {
  emailOrUserId: string; // รับอีเมลหรือไอดี
  password: string;
};

export type PublicUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
