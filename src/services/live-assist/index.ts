import { liveAssist } from "@/packages/live-assist"
import { Router } from "express"
import { z } from "zod"

const router = Router()

router.post("/add", async (req, res) => {
  const { phoneNumber } = req.body
  await liveAssist().add(z.string().min(6).parse(phoneNumber))
  res.success({
    phoneNumber,
  })
})

export { router }
