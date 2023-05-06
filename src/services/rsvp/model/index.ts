import { Schema, model } from "mongoose"

import { z } from "zod"

const DB_RSVP_RECORD = "rsvpRecord"

export const rsvpRecordStatus = z.enum([
  "TICKET", // Generate ticket
  "SUBMISSION", // User do submission
  "SUBMISSION.APPROVE", // Submission user already approved by admin
  "RESOLVE", // Payment has received by admin
  "REJECT", // Rsvp submission has rejected by admin
])

export type RSVP_RECORD_STATUS = z.infer<typeof rsvpRecordStatus>

const rsvpRecord = new Schema(
  {
    rsvpDailyId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    seatIndex: {
      type: Number,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    capacityNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: rsvpRecordStatus.Enum.TICKET,
      enum: rsvpRecordStatus.options,
    },
    rejectedReason: {
      type: String,
      default: null,
    },
    transaction: {
      type: new Schema({
        date: {
          type: Date,
          required: false,
          default: null,
        },
        amount: {
          type: Number,
          required: true,
        },
      }),
      required: true,
    },
    products: {
      type: [
        new Schema({
          productId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          note: {
            type: String,
            default: null,
            required: false,
          },
          amount: {
            type: Number,
            required: true,
          },
        }),
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
)

const productValidator = z.object({
  productId: z.string().min(1),
  note: z.string().optional().catch(undefined),
  amount: z.number(),
})

export const rsvpRecordValidator = z.object({
  phoneNumber: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  date: z.string(),
  time: z.string(),
  seatIndex: z.number(),
  capacity: z.string(),
  capacityNumber: z.number(),
  status: rsvpRecordStatus.optional().catch(undefined),
  rejectedReason: z.string().optional().catch(undefined),
  products: z.array(productValidator).min(1),
  transaction: z.object({
    amount: z.number(),
  }),
})

export const RsvpRecord = model(DB_RSVP_RECORD, rsvpRecord, DB_RSVP_RECORD)

const DB_RSVP_DAILY = "rsvpDaily"

const rsvpDailyRecord = new Schema({
  date: {
    type: Date,
    required: true,
  },
  records: {
    type: [
      new Schema({
        recordId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        seat: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          default: rsvpRecordStatus.Enum.TICKET,
          enum: rsvpRecordStatus.options,
        },
      }),
    ],
    default: [],
  },
})

export const RsvpDaily = model(DB_RSVP_DAILY, rsvpDailyRecord, DB_RSVP_DAILY)
