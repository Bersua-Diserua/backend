import { Product } from "../model"

export async function listProducts() {
  return Product.find({})
}
