import { Types } from "mongoose"
import { RsvpRecord, rsvpRecordStatus } from "../../model"
import { BadRequest, NotFound } from "@/packages/error"
import { z } from "zod"

const schema = z.object({
  status: rsvpRecordStatus,
  rejectedReason: z.string().nullable(),
  customerId: z.instanceof(Types.ObjectId),
  rsvpDailyId: z.instanceof(Types.ObjectId),
  capacity: z.string(),
  capacityNumber: z.number(),
  date: z.instanceof(Date),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  seatIndex: z.number(),
  time: z.string(),
  transaction: z.object({ date: z.null(), amount: z.number() }),
  id: z.instanceof(Types.ObjectId),
  products: z.array(
    z.object({
      productId: z.instanceof(Types.ObjectId),
      note: z.string(),
      amount: z.number(),
      product: z.object({
        name: z.string(),
        category: z.instanceof(Types.ObjectId),
        price: z.object({ amount: z.number(), unit: z.string() }),
        id: z.instanceof(Types.ObjectId),
      }),
    })
  ),
  customer: z.object({
    id: z.instanceof(Types.ObjectId),
    name: z.string().nullable(),
    phoneNumber: z.string().nullable(),
  }),
})

export async function getDetailsRsvpByRecordId(recordId: string) {
  const query = await RsvpRecord.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(recordId),
      },
    },
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $lookup: {
        from: "product",
        localField: "products.productId",
        foreignField: "_id",
        as: "products.product",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: 1,
              category: 1,
              price: {
                amount: 1,
                unit: 1,
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$products.product",
      },
    },
    {
      $group: {
        _id: "$_id",
        products: {
          $push: "$products",
        },
      },
    },
    {
      $lookup: {
        from: "rsvpRecord",
        localField: "_id",
        foreignField: "_id",
        as: "record",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              rsvpDailyId: 1,
              status: 1,
              rejectedReason: 1,
              customerId: 1,
              capacity: 1,
              capacityNumber: 1,
              date: 1,
              email: 1,
              name: 1,
              phoneNumber: 1,
              seatIndex: 1,
              time: 1,
              transaction: {
                date: 1,
                amount: 1,
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$record",
    },
    {
      $addFields: {
        "record.products": "$products",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$record",
      },
    },
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
      $unwind: "$customer",
    },
    {
      $unset: ["products._id"],
    },
  ])

  const data = query[0]
  if (!data) throw new NotFound()

  const validate = schema.safeParse(data)
  if (!validate.success) {
    throw new BadRequest(null, null, { context: validate.error })
  }

  return validate.data
}
