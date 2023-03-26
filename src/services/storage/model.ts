import { Schema, model } from "mongoose";

export const DB_STORAGE = "storage";

const StorageSchema = new Schema({
  fileId: { type: String, required: true, index: "text" },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  feature: { type: String, default: null },
});

export const StorageModel = model(DB_STORAGE, StorageSchema, DB_STORAGE);
