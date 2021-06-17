import jwt from "jsonwebtoken";

export default async function (id: string): Promise<string> {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: process.env.JWT_EXPIRE_TIME!,
  });
}
