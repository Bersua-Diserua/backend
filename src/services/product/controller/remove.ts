import { NotFound } from "@/packages/error"
import { Product } from "../model"

export async function removeProduct(productId: string) {
  const product = await Product.findByIdAndRemove(productId)
  if (!product) throw new NotFound()
  return product
}
