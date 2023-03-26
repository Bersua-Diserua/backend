import { NotFound } from "@/packages/error";
import { Customer } from "../model";

export async function findByPhoneNumber(phoneNumber: string) {
  const cust = await Customer.findOne({
    phoneNumber,
  });
  if (!cust) throw new NotFound();
  return cust;
}
