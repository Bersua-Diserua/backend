import { BadRequest } from "@/packages/error";
import { Customer, customerValidator } from "../model";

export async function createNewCustomer(payload: TObjUnknown) {
  const validate = customerValidator.safeParse(payload);
  if (!validate.success)
    throw new BadRequest(null, null, { context: validate.error });

  const newCust = new Customer({
    ...validate.data,
  });

  return newCust.save();
}
