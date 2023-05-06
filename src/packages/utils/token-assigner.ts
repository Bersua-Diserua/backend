import type { NextFunction, Request, Response } from "express"

export function tokenAssignerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.headers)
  const token =
    req.headers.authorization ||
    (req.headers["Authorization"] as string) ||
    (req.headers["x-api-key"] as string)

  req.token = token!
  next()
}
