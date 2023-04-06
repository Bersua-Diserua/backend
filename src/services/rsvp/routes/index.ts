import { Router } from "express"
import { config } from "../constant/seat"
import { getNewRsvpTicket, obtainTicket } from "../controller/obtain-ticket"
import { submitReservation } from "../controller/submit"
import { obtainByDate } from "../controller/rsvp-daily"

const router = Router()

router.get("/ticket", async (req, res) => {
  const ticket = await getNewRsvpTicket(req.query.phoneNumber as string)
  res.success({
    redirectTo:
      "https://serua.ke-gap-bocil.my.id/rsvp/" + ticket._id.toString(),
    id: ticket._id,
  })
})

router.get("/seat-management", async (req, res) => {
  res.success({
    seats: config.sort((a, b) => a.index - b.index),
  })
})

router.get("/details/:ticketId", async (req, res) => {
  const rsvp = await obtainTicket(req.params.ticketId)
  res.success({
    rsvp: {
      id: rsvp._id,
      status: rsvp.status,
      phoneNumber: rsvp.phoneNumber,
    },
  })
})

router.post("/submit/:ticketId", async (req, res) => {
  const result = await submitReservation(req.params.ticketId, req.body)
  res.success({
    result,
  })
})

router.get("/management", async (req, res) => {
  const { date } = req.query
  const rsvp = await obtainByDate(date as string)
  res.success({
    rsvp,
  })
})

export { router }
