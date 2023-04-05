import { Router } from "express"

const router = Router()

router.get("/data", async (req, res) => {
  console.log({ query: req.query })
  res.success({})
})

export { router }
