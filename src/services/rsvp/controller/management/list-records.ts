import { validateBadRequest } from "@/packages/common"
import { endOfToday, startOfToday } from "date-fns"
import { Request } from "express"
import { z } from "zod"
import { RsvpDaily } from "../../model"

const queryValidator = z.object({
  type: z.enum(["today", "month", "ago"]),
})

export async function listRecordsRsvp(req: Request) {
  const { type } = validateBadRequest(req.query, queryValidator)

  let date: Record<string, unknown> = {}

  const start = startOfToday()
  const endToday = endOfToday()
  const end = startOfToday()
  end.setDate(end.getDate() + 30)

  if (type === "ago") date = { $lt: start }
  else if (type === "month") date = { $gte: start, $lte: end }
  else date = { $gte: start, $lte: endToday }

  const query = await RsvpDaily.aggregate([
    {
      $match: {
        date,
      },
    },
    {
      $unwind: {
        path: "$records",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$records", { date: "$date" }],
        },
      },
    },
    {
      $match: {
        status: {
          $ne: "TICKET",
        },
      },
    },
    {
      $lookup: {
        from: "rsvpRecord",
        localField: "recordId",
        foreignField: "_id",
        as: "record",
        pipeline: [
          { $limit: 1 },
          {
            $addFields: {
              products: {
                $sum: "$products.amount",
              },
            },
          },
          {
            $unset: ["_id", "updatedAt", "__v"],
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$record",
      },
    },
    {
      $project: {
        _id: 0,
        id: "$recordId",
        seat: 1,
        status: 1,
        date: "$record.date",
        time: "$record.time",
        email: "$record.email",
        name: "$record.name",
        rsvpDaily: {
          id: "$record.rsvpDailyId",
          date: "$date",
        },
        capacity: "$record.capacity",
        transaction: {
          date: 1,
          amount: 1,
        },
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ])

  return {
    result: query,
    meta: {
      start,
      end,
    },
  }
}
