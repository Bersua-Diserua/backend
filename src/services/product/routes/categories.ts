import { verifyToken } from "@/packages/authorization"
import { NotFound } from "@/packages/error"
import { Router } from "express"
import { Category } from "../model"

const router = Router()

router.get("/", async (req, res) => {
  const categories = await Category.aggregate([
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: 1,
      },
    },
  ])

  res.success({ categories })
})

router.post("/", verifyToken(["ADMIN", "SUPERADMIN"]), async (req, res) => {
  const newCategory = await Category.create({
    name: req.body.name,
  })

  res.success({
    category: newCategory._id,
  })
})

router.put(
  "/:categoryId",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { categoryId } = req.params
    const category = await Category.findById(categoryId)
    if (!category) throw new NotFound()

    category.name = req.body.name

    await category.save()

    res.success({
      category: category._id,
    })
  }
)

router.delete(
  "/:categoryId",
  verifyToken(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { categoryId } = req.params
    const category = await Category.findByIdAndDelete(categoryId)
    if (!category) throw new NotFound()
    res.success({
      category: category._id,
    })
  }
)

export default router
