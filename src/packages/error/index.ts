import { ZodError } from "zod";

type ErrorOptions = {
  errorCode?: number;
  context?: ZodError | string | { [key: string]: any };
};

interface ErrorData {
  defaultMessage: string;
}

export class ResponseError extends Error implements ErrorData {
  public status = 500;
  public serviceName!: string;
  public errorOptions: ErrorOptions = {};
  public defaultMessage = "Unhandled error";

  constructor(
    message?: string | null,
    serviceName?: string | null,
    options?: ErrorOptions
  ) {
    super(message || undefined);
    if (serviceName) this.serviceName = serviceName;
    if (options) Object.assign(this.errorOptions, options);
  }

  // Use default message if instanced error without error message
  public getErrorMessage() {
    return this.message || this.defaultMessage;
  }

  public getErrorCtx() {
    return this.errorOptions.context;
  }

  public getErrorCode() {
    return this.errorOptions.errorCode || undefined;
  }
}

export class BadRequest extends ResponseError {
  public status: number = 400;
  public defaultMessage = "Bad Request";
  constructor(
    message?: string | null,
    serviceName?: string | null,
    options?: ErrorOptions
  ) {
    super(message, serviceName, options);
    if (typeof options?.context === "string") {
      this.errorOptions.context = options.context;
    } else if (options?.context instanceof ZodError) {
      this.errorOptions.context = options.context.flatten().fieldErrors;
    } else if (options?.context) {
      this.errorOptions.context = options.context;
    }
  }
}

export class NotFound extends ResponseError {
  public status: number = 404;
  public defaultMessage = "Not Found";
}

export class NotAuthenticated extends ResponseError {
  public status: number = 401;
  public defaultMessage = "Authentication failed, invalid token";
}
export class NotAuthorized extends ResponseError {
  public status: number = 401;
  public defaultMessage = "User not authorized for this action";
}

export class Conflict extends ResponseError {
  public status: number = 409;
  public defaultMessage = "Conflict";
}
