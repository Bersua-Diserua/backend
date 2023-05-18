import { Schema, model } from "mongoose"

const DB_RSVP_SEAT = "rsvpSeat"

const rsvpSeat = new Schema(
  {
    position: {
      type: Schema.Types.Mixed,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    capacity: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    dateDisabled: [
      {
        type: Date,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const RsvpSeat = model(DB_RSVP_SEAT, rsvpSeat, DB_RSVP_SEAT)

// RsvpSeat.find({})
//   .then((x) => {
//     const write = x.map((y) => {
//       y.dateDisabled = []
//       return y
//     })

//     return RsvpSeat.bulkSave(write)
//   })
//   .then(console.log)
//   .catch(console.error)
