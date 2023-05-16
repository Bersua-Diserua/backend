import { Router } from "express"
import { getSysConfig } from "./controller"

const router = Router()

router.get("/", async (req, res) => {
  const { adminJids, internalGroupIds } = await getSysConfig()
  res.success({
    config: {
      adminJids,
      internalGroupIds,
    },
  })
})

export { router }
