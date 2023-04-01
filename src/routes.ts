import { Router } from "express"

// Services
import { router as AccountServices } from "@services/account"
import { router as ProductServices } from "@services/product"
import { router as RsvpServices } from "@services/rsvp"

const router = Router()

router.use((req, res, next) => {
  console.log({
    url: req.url,
  })
  next()
})

router.use("/auth", AccountServices)
router.use("/product", ProductServices)
router.use("/rsvp", RsvpServices)

export { router as GlobalRouter }
