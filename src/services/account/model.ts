import { model, Schema } from "mongoose"
import { z } from "zod"

export const role = z.enum(["ADMIN", "SUPERADMIN", "SEVA"])

const DB_ACCOUNT = "account"

const account = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: role.options,
      required: true,
    },
  },
  { timestamps: true }
)

export const Account = model(DB_ACCOUNT, account, DB_ACCOUNT)

const DB_ACCOUNT_CREDENTIAL = "accountCredential"

const credential = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
    min: 1,
  },
})

export const AccountCredential = model(
  DB_ACCOUNT_CREDENTIAL,
  credential,
  DB_ACCOUNT_CREDENTIAL
)

export const accountValidator = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
})
