import { getRangeInOneDay } from "@/packages/utils/date"
import { RsvpDaily } from "../model"

export async function obtainByDate(date: string) {
  const { start, end } = getRangeInOneDay(new Date(date))

  console.log({
    start: start.toLocaleDateString(),
    end: end.toLocaleDateString(),
  })

  console.log({
    start,
    end,
  })

  let query = await RsvpDaily.aggregate([
    {
      $match: {
        date: {
          $gte: new Date("2023-04-08T17:01:28.812Z"),
          $lte: new Date("2023-04-09T17:01:28.812Z"),
        },
      },
    },
  ])

  let rsvpRaw = query[0]

  if (!rsvpRaw) {
    console.log("Create new summary rsvp record")
    return RsvpDaily.create({
      date: start,
      records: [],
    })
  } else {
    return (await RsvpDaily.findById(rsvpRaw._id))!
  }
}
