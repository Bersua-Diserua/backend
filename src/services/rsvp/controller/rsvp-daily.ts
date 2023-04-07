import { getDateWithoutTime } from "@/packages/utils/date"
import { RsvpDaily } from "../model"

export async function obtainByDate(date: string) {
  const validDate = getDateWithoutTime(date).iso()

  let rsvp = await RsvpDaily.findOne({
    date: {
      $gte: validDate,
      $lt: validDate,
    },
  })

  if (!rsvp) {
    console.log("Create new summary rsvp record")
    rsvp = await RsvpDaily.create({
      date: validDate,
      records: [],
    })
  }

  return rsvp
}
