import { Router } from "express"
import { customerStore } from "../controller/customer-store"
import { Customer } from "../model"
import { verifyToken } from "@/packages/authorization"

const router = Router()

router.get("/data", async (req, res) => {
  const { phoneNumber } = req.query

  const customer = await customerStore.obtainByPhone(phoneNumber as string)
  res.success({
    customer,
  })
})

router
  .use(verifyToken(["ADMIN", "SUPERADMIN"]))
  .get("/management", async (req, res) =>
    res.success({
      customers: await Customer.aggregate([
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            phoneNumber: 1,
          },
        },
      ]),
    })
  )

export { router }
