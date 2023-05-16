import { RsvpDaily } from "../model"
import { RsvpSeat } from "../model/seat"
import { SeatProps } from "../constant/seat"
import { getRangeInOneDay } from "@/packages/utils/date"
import { getRangeInThirtyForward } from "../../../packages/utils/date"

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

export async function obtainByDateV2(date: string) {
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

  let rsvpDaily

  if (!rsvpRaw) {
    console.log("Create new summary rsvp record")
    end.setHours(end.getHours() + 1)
    const date = new Date(end.toISOString())
    rsvpDaily = await RsvpDaily.create({
      date,
      records: [],
    })
  } else {
    rsvpDaily = (await RsvpDaily.findById(rsvpRaw._id))!
  }

  const seats = await getSeatsByDate(start, end)

  return { rsvpDaily, seats }
}

async function getSeatsByDate(start: Date, end: Date): Promise<SeatProps[]> {
  let query = await RsvpSeat.aggregate([
    {
      $addFields: {
        isDisabled: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$dateDisabled",
                  cond: {
                    $and: [
                      {
                        $lte: [start, "$$date"],
                      },
                      {
                        $gte: [end, "$$date"],
                      },
                    ],
                  },
                  as: "date",
                  limit: 1,
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $unset: ["_id", "__v", "createdAt", "updatedAt"],
    },
  ])

  return query
}

export async function obtainByDateAndForward(date: string) {
  const { start, end } = getRangeInThirtyForward(new Date(date))

  let query = await RsvpDaily.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
  ])

  return { rsvpMonthly: query.map((val) => val._id) }
}
