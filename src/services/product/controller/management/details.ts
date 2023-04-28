import { NotFound } from "@/packages/error"
import { Product } from "../../model"
import { Types } from "mongoose"

export async function detailsProduct(productId: string) {
  const query = await Product.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(productId),
        isDeleted: {
          $not: {
            $eq: true,
          },
        },
      },
    },
    {
      $lookup: {
        from: "storage",
        localField: "images",
        foreignField: "_id",
        as: "images",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              url: "$filePath",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "category",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: 1,
        desc: 1,
        price: {
          amount: 1,
          unit: 1,
        },
        images: 1,
        category: {
          id: "$category._id",
          name: "$category.name",
        },
        status: {
          $ifNull: ["$status", "A"],
        },
      },
    },
  ])

  const data = query[0]
  if (!data) throw new NotFound()

  return data
}
