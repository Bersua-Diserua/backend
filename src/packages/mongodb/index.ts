import mongoose from "mongoose";
import { config } from "@/packages/config";

mongoose.set("strictQuery", false);
const mongoConnect = () => {
  console.log("Estabilished mongo");
  return mongoose.connect(config.MONGO_URI);
};

export { mongoConnect };
