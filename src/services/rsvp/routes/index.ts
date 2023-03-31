import { Router } from "express"

const router = Router()

router.get("/ticket", async (req, res) => {
  res.success({
    redirectTo: "bersua.diserua.com",
  })
})

export { router }
