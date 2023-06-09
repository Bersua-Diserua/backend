import { BadRequest, NotFound } from "@/packages/error"
import { Product, productValidator } from "../model"

import { upload } from "@/services/storage"

export async function updateProduct(productId: string, payload: TObjUnknown) {
  const validated = productValidator.deepPartial().safeParse(payload)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })

  const product = await Product.findById(productId)
  if (!product) throw new NotFound()

  let { images } = validated.data
  if (images && images.length > 0) {
    validated.data.images = await Promise.all(
      images.map((image) =>
        upload(image, Date.now().toString(), "product").then((x) =>
          x._id.toString()
        )
      )
    )
  }

  Object.assign(product, validated.data)

  console.log({ product })

  return product.save()
}

export async function updateStatusProduct(productId: string, status: string) {
  if (status === null) throw new BadRequest("Status field must be filled", null)

  const product = await Product.findById(productId)
  if (!product) throw new NotFound()

  Object.assign(product, {
    status,
  })

  return product.save()
}
