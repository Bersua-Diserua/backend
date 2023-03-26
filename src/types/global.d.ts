import { type Types } from "mongoose";
import { type z } from "zod";
import { role } from "@services/account/model";

declare global {
  type ObjectId = Types.ObjectId;

  type TObjUnknown = Record<string, unknown>;

  type Roles = z.infer<typeof role>;
}
