import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_RSVP_RECORD = "rsvpRecord"

const rsvpRecordStatus = z.enum(["PENDING", "RESOLVE", "REJECT", "TICKET"])

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
      required: true,
      enum: rsvpRecordStatus.options,
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

export const RsvpRecord = model(DB_RSVP_RECORD, rsvpRecord, DB_RSVP_RECORD)

const rsvpDailyRecord = new Schema({
  date: {
    type: Date,
    unique: true,
  },
  records: [
    {
      type: rsvpRecord,
      default: [],
      required: true,
    },
  ],
})
