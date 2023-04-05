import { Router } from "express"
import { config } from "../constant/seat"
import { getRsvpTicket } from "../controller/obtain-ticket"

const router = Router()

router.get("/ticket", async (req, res) => {
  const ticket = await getRsvpTicket("")
  res.success({
    redirectTo: "https://serua.ke-gap-bocil.my.id/rsvp/" + ticket.toString(),
    id: ticket,
  })
})

router.get("/seat-management", async (req, res) => {
  res.success({
    seats: config.sort((a, b) => a.index - b.index),
  })
})

export { router }
