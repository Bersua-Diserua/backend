import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_RSVP = "rsvp"

const rsvpRecordStatus = z.enum(["PENDING", "RESOLVE", "REJECT"])

const rsvpRecord = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
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
})

const DB_SEAT = "seat"

const seat = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
})

export const Seat = model(DB_SEAT, seat, DB_SEAT)

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
