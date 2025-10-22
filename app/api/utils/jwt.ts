export function getJwtExpires(): string | number {
  const v = process.env.JWT_EXPIRES;
  if (!v || v.trim() === "") return "7d";
  // ถ้าเป็นตัวเลขล้วน ให้ส่งเป็น number
  return /^\d+$/.test(v) ? Number(v) : v;
}