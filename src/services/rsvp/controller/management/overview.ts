import { z } from "zod"
import { RsvpDaily } from "../../model"
import { startOfToday, endOfToday } from "date-fns"
import { rsvpRecordStatus } from "../../model"

const overviewSchema = z.object({
  status: rsvpRecordStatus,
  count: z.number().catch(0),
})

const summary = z.object({
  today: z.array(overviewSchema),
  month: z.array(overviewSchema),
})

function fillSummaryStatus(data: unknown) {
  const raw = summary.parse(data)
  const { month, today } = raw

  return {
    fill(arg: z.infer<typeof overviewSchema>[]) {
      return rsvpRecordStatus.options.map((x) => {
        return overviewSchema.parse(
          arg.find((y) => y.status == x) || { status: x }
        )
      })
    },
    month() {
      return this.fill(month)
    },
    today() {
      return this.fill(today)
    },
  }
}

export async function rsvpOverview() {
  const start = startOfToday()
  const endToday = endOfToday()
  const end = startOfToday()
  end.setDate(end.getDate() + 30)

  const queryResult = await RsvpDaily.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $facet: {
        month: [
          {
            $sort: {
              date: 1,
            },
          },
          {
            $unwind: {
              path: "$records",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $replaceRoot: {
              newRoot: "$records",
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $count: {} },
            },
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1,
            },
          },
        ],
        today: [
          {
            $match: {
              date: {
                $gte: start,
                $lte: endToday,
              },
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
          {
            $unwind: {
              path: "$records",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $replaceRoot: {
              newRoot: "$records",
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $count: {} },
            },
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1,
            },
          },
        ],
      },
    },
  ])

  return {
    toJson() {
      const filled = fillSummaryStatus(queryResult[0])
      return {
        metadata: {
          start,
          endToday,
          end,
        },
        today: filled.today(),
        month: filled.month(),
      }
    },
  }
}
