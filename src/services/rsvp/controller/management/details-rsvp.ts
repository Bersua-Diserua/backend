import { Types } from "mongoose"
import { RsvpRecord } from "../../model"
import { NotFound } from "@/packages/error"

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
  ])

  const data = query[0]
  if (!data) throw new NotFound()

  return data
}
