import { z } from "zod"
import { RsvpDaily } from "../../model"
import { startOfToday, endOfToday } from "date-fns"
import { rsvpRecordStatus } from "../../model"
import { PipelineStage } from "mongoose"

const overviewSchema = z.object({
  status: rsvpRecordStatus,
  count: z.number().catch(0),
})

const summary = z.object({
  today: z.array(overviewSchema),
  month: z.array(overviewSchema),
  ago: z.array(overviewSchema),
})

function fillSummaryStatus(data: unknown) {
  const raw = summary.parse(data)
  const { month, today, ago } = raw

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
    ago() {
      return this.fill(ago)
    },
  }
}

export async function rsvpOverview() {
  const start = startOfToday()
  const endToday = endOfToday()
  const end = startOfToday()
  end.setDate(end.getDate() + 30)

  const basePipelines: PipelineStage.FacetPipelineStage[] = [
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
  ]

  const queryResult = await RsvpDaily.aggregate([
    {
      $facet: {
        ago: [
          {
            $match: {
              date: {
                $lt: start,
              },
            },
          },
          ...basePipelines,
        ],
        month: [
          {
            $match: {
              date: {
                $gte: start,
                $lte: end,
              },
            },
          },
          ...basePipelines,
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
          ...basePipelines,
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
        ago: filled.ago(),
      }
    },
  }
}
