// Services
import { router as AccountServices } from "@services/account"
import { router as BotServices } from "@services/bot"
import { router as ProductServices } from "@services/product"
import { Router } from "express"
import { router as RsvpServices } from "@services/rsvp"

const router = Router()

router.use("/auth", AccountServices)
router.use("/product", ProductServices)
router.use("/rsvp", RsvpServices)
router.use("/bot", BotServices)

export { router as GlobalRouter }
