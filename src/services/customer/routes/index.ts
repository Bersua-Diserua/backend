import { Router } from "express"
import { customerStore } from "../controller/customer-store"

const router = Router()

router.get("/data", async (req, res) => {
  const { phoneNumber } = req.query
  const customer = await customerStore.obtainByPhone(phoneNumber as string)
  res.success({
    customer,
  })
})

export { router }
