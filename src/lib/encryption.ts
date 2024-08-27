import bcrypt from "bcryptjs";

export async function encrypt(data: string) {
  return await bcrypt.hash(data, 10);
}
export async function match(data: string, encryptedData: string) {
  return await bcrypt.compare(data, encryptedData);
}
