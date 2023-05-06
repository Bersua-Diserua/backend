import { Router } from "express"

// Services
import { router as AccountServices } from "@services/account"
import { router as BotServices } from "@services/bot"
import { router as ProductServices } from "@services/product"
import { router as RsvpServices } from "@services/rsvp"
import { router as CustomerServices } from "@services/customer"
import { router as SysConfigServices } from "@services/sysconfig"
import { router as LiveAssistServices } from "@services/live-assist"

const router = Router()

router.use((req, res, next) => {
  console.log({ url: req.url })
  next()
})

router.use("/auth", AccountServices)
router.use("/product", ProductServices)
router.use("/rsvp", RsvpServices)
router.use("/customer", CustomerServices)
router.use("/bot", BotServices)
router.use("/sys-config", SysConfigServices)
router.use("/live-assist", LiveAssistServices)

export { router as GlobalRouter }
