import type { NextFunction, Request, Response } from "express"

export function tokenAssignerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization ||
    String(req.headers["Authorization"]) ||
    undefined

  req.token = token!
  next()
}
