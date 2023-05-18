import { DB_STORAGE } from "@/services/storage/model"
import { TemplateMessage } from "../models/template-message"
import { config } from "@/packages/config"

export async function getResponseList() {
  const queryTemplateMessage = await TemplateMessage.aggregate([
    {
      $lookup: {
        from: DB_STORAGE,
        localField: "fileId",
        foreignField: "_id",
        as: "image",
      },
    },
    {
      $unwind: {
        path: "$image",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        commandCode: 1,
        message: 1,
        type: 1,
        image: {
          $concat: [config.IMAGEKIT_ENDPOINT, "$image.filePath"],
        },
      },
    },
  ])

  return queryTemplateMessage
}
