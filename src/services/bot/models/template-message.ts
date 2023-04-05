import { Schema, model } from "mongoose"

import { z } from "zod"

export const DB_TEMPLATE_MESSAGE = "templateMessage"

export const MESSAGE_TYPE = z.enum(["TEXT", "IMAGE"])

const templateMessageSchema = new Schema(
  {
    commandCode: { type: Number, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: MESSAGE_TYPE.options,
      default: MESSAGE_TYPE.Enum.TEXT,
    },
    fileId: { type: Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: true,
  }
)

export const TemplateMessage = model(
  DB_TEMPLATE_MESSAGE,
  templateMessageSchema,
  DB_TEMPLATE_MESSAGE
)
