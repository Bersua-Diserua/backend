import { NotFound } from "@/packages/error"
import { Types } from "mongoose"
import { Product } from "../../model"

export async function detailsProduct(productId: string) {
  const query = await Product.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(productId),
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
      },
    },
  ])

  const data = query[0]
  if (!data) throw new NotFound()

  return data
}
