import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_RSVP_RECORD = "rsvpRecord"

const rsvpRecordStatus = z.enum(["TICKET", "PENDING", "RESOLVE", "REJECT"])

const rsvpRecord = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
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
    menu: [
      {
        type: new Schema({
          menuId: {
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
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true }
)

export const rsvpRecordValidator = z.object({
  date: z.string(),
  seatIndex: z.number(),
})

export const RsvpRecord = model(DB_RSVP_RECORD, rsvpRecord, DB_RSVP_RECORD)

const DB_RSVP_DAILY = "rsvpDaily"

const rsvpDailyRecord = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  records: [
    {
      type: new Schema({
        recordId: {
          type: Schema.Types.ObjectId,
        },
        seat: {
          type: Number,
          required: true,
        },
      }),
      default: [],
    },
  ],
})

export const RsvpDaily = model(DB_RSVP_DAILY, rsvpDailyRecord, DB_RSVP_DAILY)
