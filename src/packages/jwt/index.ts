import jwt from "jsonwebtoken"

type TokenProps = {
  id: string
  role: Roles
}

export function signToken(session: TokenProps) {
  return jwt.sign(session, "secret")
}

export function claimToken(token: string) {
  return jwt.decode(token) as TokenProps
}
