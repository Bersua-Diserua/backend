import { updateProduct, updateStatusProduct } from "../controller/update"

import CategoryRouter from "./categories"
import { Router } from "express"
import { createProduct } from "../controller/create"
import { detailsProduct } from "../controller/management/details"
import { listProducts } from "../controller/management/list"
import { removeProduct } from "../controller/remove"
import { verifyToken } from "@/packages/authorization"

const router = Router()

router.get("/", async (req, res) => {
  const products = await listProducts()
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
  console.log({ body: req.body })
  const { productId } = req.params
  const product = await updateProduct(productId, req.body)

  res.success({
    product,
  })
})

router.put("/management/:productId/status", async (req, res) => {
  const { productId } = req.params
  const { status } = req.body

  let state = "A"
  if (status === "false") state = "D"

  console.log({ productId, state })

  const product = await updateStatusProduct(productId, state)

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

router.use("/category", CategoryRouter)

export { router }
