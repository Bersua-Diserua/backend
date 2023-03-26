import { Router } from "express"
import { createNewAdminAccount } from "../controller/create"
import { signin } from "../controller/signin"

const router = Router()

router.post("/signup/admin", async (req, res) => {
  const newAcc = await createNewAdminAccount(req.body)
  res.success({
    id: newAcc._id,
  })
})

router.post("/signin", async (req, res) => {
  const acc = await signin(req.body)
  res.success(acc)
})

export { router }
