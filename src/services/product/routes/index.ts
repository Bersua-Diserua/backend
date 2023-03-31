import { Router } from "express"
import { createProduct } from "../controller/create"
import { removeProduct } from "../controller/remove"
import { updateProduct } from "../controller/update"

const router = Router()

router.post("/record", async (req, res) => {
  const product = await createProduct(req.body)
  res.success({
    product,
  })
})

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
