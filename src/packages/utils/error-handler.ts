import { config } from "@packages/config";
import { ResponseError } from "@/packages/error";
import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (config.NODE_ENV !== "development")
    console.log(`[${req.url}]: ${JSON.stringify(err)}`);

  let message = "Unhandled error";
  let status: number = 500;
  let error: any = undefined;
  let stack: any = undefined;
  let context: any = undefined;
  let code: number | undefined = undefined;

  let serviceName = "Service not defined";

  if (err instanceof MongooseError.CastError) {
    message = err.message;
    stack = err.stack;
    error = err;
    status = 401;
  } else if (err instanceof MongooseError.ValidationError) {
    message = err.message;
    stack = err.stack;
    error = err;
    status = 401;
  } else if (err instanceof ResponseError) {
    message = err.getErrorMessage();
    error = err.serviceName;
    stack = err.stack;
    status = err.status;
    context = err.getErrorCtx();
    code = err.getErrorCode();
  } else if (err instanceof Error) {
    message = err.message;
    error = err.cause;
    stack = err.stack;
    status = 500;
  } else {
    message = err;
  }

  if (err instanceof ResponseError) {
    serviceName = err.serviceName || req.url.split("/")[1]?.toUpperCase();
  }

  res.status(status).json({
    message,
    code,
    error,
    stack,
    context,
    serviceName,
  });
}
