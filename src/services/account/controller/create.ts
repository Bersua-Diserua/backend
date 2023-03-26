import { findByEmail } from "./find"
import { accountValidator, Account, AccountCredential } from "../model"
import { BadRequest, Conflict } from "@/packages/error"
import { encrypt } from "@/packages/bcrypt"

async function createNewAccount(payload: TObjUnknown, role: Roles) {
  const validate = accountValidator.safeParse(payload)
  if (!validate.success)
    throw new BadRequest(null, null, { context: validate.error })

  const { email, password } = validate.data

  const exits = await findByEmail(email)
    .then(() => true)
    .catch(() => false)

  if (exits) throw new Conflict(`${email} already registered`)

  const newAcc = new Account({
    ...validate.data,
    role,
  })

  const credential = new AccountCredential({
    accountId: newAcc._id,
    hash: await encrypt(password),
  })

  await credential.save()
  return newAcc.save()
}

export async function createNewAdminAccount(payload: TObjUnknown) {
  return createNewAccount(payload, "ADMIN")
}

export async function createNewSuperAdminAccount(payload: TObjUnknown) {
  return createNewAccount(payload, "SUPERADMIN")
}
