import { obtainByDate, obtainByDateAndForward } from "../rsvp-daily"

import { RsvpDaily } from "../../model"
import { Types } from "mongoose"
import { rsvpRecordStatus } from "../../model"
import { z } from "zod"

const schema = z.array(
  z.object({
    recordId: z.instanceof(Types.ObjectId),
    seat: z.number(),
    status: rsvpRecordStatus,
    details: z.object({
      status: rsvpRecordStatus,
      rejectedReason: z.string().nullable(),
      capacity: z.string(),
      capacityNumber: z.number(),
      date: z.instanceof(Date),
      email: z.string(),
      name: z.string(),
      phoneNumber: z.string(),
      seatIndex: z.number(),
      time: z.string(),
      transaction: z.object({
        date: z.instanceof(Date).nullable(),
        amount: z.number(),
      }),
      customer: z.object({
        name: z.null(),
        phoneNumber: z.string(),
        id: z.instanceof(Types.ObjectId),
      }),
    }),
  })
)

export async function getRsvpByDate(date: string) {
  const summary = await obtainByDate(date)
  // const { rsvpDaily } = await obtainByDateV2(date)
  const query = await RsvpDaily.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(summary._id),
      },
    },
    {
      $limit: 1,
    },
    {
      $unwind: {
        path: "$records",
      },
    },
    {
      $lookup: {
        from: "rsvpRecord",
        localField: "records.recordId",
        foreignField: "_id",
        as: "records.details",
        pipeline: [
          {
            $lookup: {
              from: "customer",
              localField: "customerId",
              foreignField: "_id",
              as: "customer",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    phoneNumber: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$customer",
            },
          },
          {
            $unset: [
              "customerId",
              "createdAt",
              "updatedAt",
              "__v",
              "_id",
              "products",
              "transaction._id",
            ],
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$records.details",
      },
    },
    {
      $group: {
        _id: "$_id",
        records: {
          $push: "$records",
        },
      },
    },
    {
      $unset: ["records._id"],
    },
    {
      $unwind: {
        path: "$records",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$records",
      },
    },
  ])

  const data = schema.parse(query)

  return {
    records: data,
    summary,
  }
}

export async function getRsvpThirtyForward(date: string) {
  const { rsvpMonthly } = await obtainByDateAndForward(date)
  const query = await RsvpDaily.aggregate([
    {
      $match: {
        _id: {
          $in: rsvpMonthly,
        },
      },
    },
    {
      $unwind: {
        path: "$records",
      },
    },
    {
      $lookup: {
        from: "rsvpRecord",
        localField: "records.recordId",
        foreignField: "_id",
        as: "records.details",
        pipeline: [
          {
            $lookup: {
              from: "customer",
              localField: "customerId",
              foreignField: "_id",
              as: "customer",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    phoneNumber: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$customer",
            },
          },
          {
            $unset: [
              "customerId",
              "createdAt",
              "updatedAt",
              "__v",
              "_id",
              "products",
              "transaction._id",
            ],
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$records.details",
      },
    },
    {
      $group: {
        _id: "$_id",
        records: {
          $push: "$records",
        },
      },
    },
    {
      $unset: ["records._id"],
    },
    {
      $unwind: {
        path: "$records",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$records",
      },
    },
  ])

  console.log({ query })

  const data = schema.parse(query)

  return {
    records: data,
    rsvpMonthly,
  }
}
