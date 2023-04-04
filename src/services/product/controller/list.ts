import config from "@/packages/config"
import { Product } from "../model"

export async function listProducts() {
  return Product.aggregate([
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
              url: {
                $concat: [config.IMAGEKIT_ENDPOINT, "$filePath"],
              },
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
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: 1,
            },
          },
        ],
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
        category: 1,
      },
    },
  ])
}
