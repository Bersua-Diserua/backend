import { BadRequest, NotFound } from "@/packages/error"
import { Product, productValidator } from "../model"

export async function updateProduct(productId: string, payload: TObjUnknown) {
  const validated = productValidator.deepPartial().safeParse(payload)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })

  const product = await Product.findById(productId)
  if (!product) throw new NotFound()

  Object.assign(product, validated.data)

  return product.save()
}
