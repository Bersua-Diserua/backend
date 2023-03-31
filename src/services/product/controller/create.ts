import { BadRequest } from "@/packages/error"
import { upload } from "@/services/storage"
import { Product, productValidator } from "../model"

export async function createProduct(payload: TObjUnknown) {
  const validated = productValidator.safeParse(payload)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })

  let { images } = validated.data

  const uploaders = await Promise.all(
    images.map((image) => upload(image, Date.now().toString(), "product"))
  )

  const newProduct = new Product({
    ...validated.data,
    images: uploaders.map((x) => x._id),
  })

  return newProduct.save()
}
