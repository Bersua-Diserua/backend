import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_RSVP_RECORD = "rsvpRecord"

export const rsvpRecordStatus = z.enum([
  "TICKET",
  "SUBMISSION",
  "SUBMISSION.APPROVE",
  "PAYMENT",
  "RESOLVE",
  "REJECT",
])

const rsvpRecord = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
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
          default: null,
        },
        amount: {
          type: Number,
          required: true,
        },
      }),
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
  date: z.string(),
  time: z.string(),
  seatIndex: z.number(),
  capacity: z.string(),
  capacityNumber: z.number(),
  status: rsvpRecordStatus.optional().catch(undefined),
  rejectedReason: z.string().optional().catch(undefined),
  products: z.array(productValidator).min(1),
})

export const RsvpRecord = model(DB_RSVP_RECORD, rsvpRecord, DB_RSVP_RECORD)

const DB_RSVP_DAILY = "rsvpDaily"

const rsvpDailyRecord = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
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
