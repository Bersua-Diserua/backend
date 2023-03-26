import { NotFound } from "@/packages/error";
import { Account } from "../model";

export async function findByEmail(email: string) {
  const acc = await Account.findOne({ email });
  if (!acc) throw new NotFound();
  return acc;
}
