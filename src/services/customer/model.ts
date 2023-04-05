import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_CUSTOMER = "customer"

const customer = new Schema(
  {
    name: {
      type: String,
      default: null,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export const Customer = model(DB_CUSTOMER, customer, DB_CUSTOMER)

export const customerValidator = z.object({
  name: z.string().min(1).optional().catch(undefined),
  phoneNumber: z.string().min(1).optional().catch(undefined),
})
