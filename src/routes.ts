import { Router } from "express"

// Services
import { router as AccountServices } from "@services/account"
import { router as ProductServices } from "@services/product"

const router = Router()

router.use("/auth", AccountServices)
router.use("/product", ProductServices)

export { router as GlobalRouter }
