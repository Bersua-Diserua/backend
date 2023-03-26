import type { Response, Request, NextFunction } from "express";

export function wrapperResponseSuccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function (data: TObjUnknown, message?: string) {
    res.json({
      message: message || "Success",
      payload: data,
    });
  };

  next();
}
