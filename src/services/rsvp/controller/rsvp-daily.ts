import { getRangeInOneDay } from "@/packages/utils/date"
import { RsvpDaily } from "../model"

export async function obtainByDate(date: string) {
  const { start, end } = getRangeInOneDay(new Date(date))

  let rsvp = await RsvpDaily.findOne({
    date: {
      $gte: start,
      $lte: end,
    },
  })

  if (!rsvp) {
    console.log("Create new summary rsvp record")
    rsvp = await RsvpDaily.create({
      date: start,
      records: [],
    })
  }

  return rsvp
}
