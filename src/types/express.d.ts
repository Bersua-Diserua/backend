declare namespace Express {
  interface Request {
    token: string;
    account: {
      id: string;
      role: Role;
    };
  }

  interface Response {
    success: (data: TObjUnknown, message?: string) => any;
  }
}
