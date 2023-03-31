import { verifyToken } from "@/packages/authorization"
import { Router } from "express"
import { createProduct } from "../controller/create"
import { removeProduct } from "../controller/remove"
import { updateProduct } from "../controller/update"
import { Product } from "../model"

const router = Router()

router.get("/", async (req, res) => {
  const products = await Product.find({})
  res.success({ products })
})

router.post(
  "/record",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const product = await createProduct(req.body)
    res.success({
      product,
    })
  }
)

router.put("/update/:productId", async (req, res) => {
  const { productId } = req.params
  const product = await updateProduct(productId, req.body)

  res.success({
    product,
  })
})

router.delete("/remove/:productId", async (req, res) => {
  const { productId } = req.params
  const product = await removeProduct(productId)
  res.success({
    product,
  })
})

export { router }
