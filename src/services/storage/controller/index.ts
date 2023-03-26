import { NotFound, ResponseError } from "@/packages/error";

import { StorageModel } from "../model";
import { imageKitClient } from "@/packages/imagekit";

const availableFolders = ["menu"] as const;

type AvailableFolders = (typeof availableFolders)[number];

export async function upload(
  blob: Buffer | string,
  fileName: string,
  folder: AvailableFolders,
  writeAccessUserId?: string[]
) {
  try {
    const uploader = await imageKitClient.upload({
      file: blob,
      fileName,
      folder,
    });

    const newStorage = new StorageModel({
      fileId: uploader.fileId,
      fileType: uploader.fileType,
      filePath: uploader.filePath,
      writeAccess: writeAccessUserId ?? [],
      feature: folder,
    });

    return newStorage.save();
  } catch (error) {
    console.error(error);
    throw new ResponseError();
  }
}

export async function removeWithCredentials(
  fileId: string,
  writeAccess: string
) {
  const file = await StorageModel.findOne({
    _id: fileId,
    writeAccess: writeAccess,
  });
  if (!file) throw new NotFound("File not found");

  imageKitClient.deleteFile(file.fileId);
  return file.deleteOne();
}
