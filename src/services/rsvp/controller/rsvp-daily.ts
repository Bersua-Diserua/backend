import { getRangeInOneDay } from "@/packages/utils/date"
import { RsvpDaily } from "../model"

export async function obtainByDate(date: string) {
  const { start, end } = getRangeInOneDay(new Date(date))

  let query = await RsvpDaily.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $limit: 1,
    },
  ])

  let rsvpRaw = query[0]

  if (!rsvpRaw) {
    console.log("Create new summary rsvp record")
    end.setHours(end.getHours() + 1)
    const date = new Date(end.toISOString())
    return RsvpDaily.create({
      date,
      records: [],
    })
  } else {
    return (await RsvpDaily.findById(rsvpRaw._id))!
  }
}
