import { Schema, model } from "mongoose"
import { z } from "zod"

const DB_FEEDBACK = "feedback"

export const feedBackSchema = z.object({
  customerId: z.string(),
  message: z.string().min(1),
})

const feedback = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

export const Feedback = model(DB_FEEDBACK, feedback, DB_FEEDBACK)
