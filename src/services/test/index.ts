import { Router } from "express"

const router = Router()

router.post("/send", async (req, res) => {
  const { phoneNumber } = req.body
})

export { router }
