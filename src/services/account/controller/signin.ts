import { compare } from "@/packages/bcrypt"
import { BadRequest, ResponseError } from "@/packages/error"
import { signToken } from "@/packages/jwt"
import { AccountCredential, accountValidator } from "../model"
import { findByEmail } from "./find"

export async function signin(payload: TObjUnknown) {
  const validate = accountValidator
    .pick({
      email: true,
      password: true,
    })
    .safeParse(payload)

  if (!validate.success)
    throw new BadRequest(null, null, { context: validate.error })

  const { email, password } = validate.data

  const acc = await findByEmail(email)
  const cred = await AccountCredential.findOne({
    accountId: acc._id,
  })

  if (!cred) throw new ResponseError("Invalid data")
  const isValidPassword = await compare(password, cred.hash)
  if (!isValidPassword) throw new BadRequest("Wrong password")

  return {
    token: signToken({
      id: acc._id.toString(),
      role: acc.role,
    }),
  }
}
