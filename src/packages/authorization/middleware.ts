import type { Response, Request, NextFunction } from "express"
import { NotAuthenticated, NotAuthorized } from "../error"
import { claimToken } from "../jwt"

export function verifyToken(roles: Roles[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { token } = req
    if (!token) throw new NotAuthorized("Token not found")

    let parsedToken
    try {
      parsedToken = claimToken(token)
    } catch (error) {
      throw new NotAuthenticated()
    }
    if (!parsedToken) throw new NotAuthenticated()

    const { id, role } = parsedToken

    const isAuthorized = roles.includes(role)
    if (!isAuthorized) throw new NotAuthorized()

    req.account = {
      id,
      role,
    }

    next()
  }
}
