import config from "@/packages/config"
import { Product } from "../../model"

export async function listProducts() {
  const query = await Product.aggregate([
    {
      $lookup: {
        from: "storage",
        localField: "images",
        foreignField: "_id",
        as: "images",
        pipeline: [
          {
            $project: {
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

  return query
}
