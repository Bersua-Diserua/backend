import { Product } from "../../model"
import config from "@/packages/config"

export async function listProducts() {
  const query = await Product.aggregate([
    // {
    //   $match: {
    //     status: {
    //       $not: {
    //         $eq: "D",
    //       },
    //     },
    //   },
    // },
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

  return query
}
