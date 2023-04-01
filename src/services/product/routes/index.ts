import { verifyToken } from "@/packages/authorization"
import { Router } from "express"
import { createProduct } from "../controller/create"
import { detailsProduct } from "../controller/management/details"
import { listProducts } from "../controller/management/list"
import { removeProduct } from "../controller/remove"
import { updateProduct } from "../controller/update"
import { Product } from "../model"

const router = Router()

router.get("/", async (req, res) => {
  const products = await Product.find({})
  res.success({ products })
})

router.get(
  "/management/list",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const products = await listProducts()
    res.success({ products })
  }
)

router.get(
  "/management/:productId/details",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { productId } = req.params
    console.log({ productId })

    const product = await detailsProduct(productId)
    res.success({ product })
  }
)

router.post(
  "/management/record",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const product = await createProduct(req.body)
    res.success({
      product,
    })
  }
)

router.put("/management/:productId/update", async (req, res) => {
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
