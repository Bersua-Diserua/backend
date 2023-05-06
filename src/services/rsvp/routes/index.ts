import { getNewRsvpTicket, obtainTicket } from "../controller/obtain-ticket"

import { Router } from "express"
import { config } from "../constant/seat"
import { generateDaysRsvp } from "../controller/management/generate-days"
import { getDetailsRsvpByRecordId } from "../controller/management/details-rsvp"
import { getRsvpByDate } from "../controller/management"
import { handleChangeRecordStatus } from "../controller/management/status-approval"
import { seatAvailable } from "../controller/seat-available"
import { submitReservation } from "../controller/submit"
import { verifyToken } from "@/packages/authorization"

const router = Router()

router.get("/ticket", async (req, res) => {
  const ticket = await getNewRsvpTicket(req.query.phoneNumber as string)
  res.success({
    redirectTo: "https://rsvp.bersuadiserua.com/rsvp/" + ticket._id.toString(),
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

router.get("/seat", async (req, res) => {
  const { date } = req.query
  const { seats } = await seatAvailable(date as string)
  res.success({
    seats,
    date,
  })
})

router.post("/submit/:ticketId", async (req, res) => {
  const result = await submitReservation(req.params.ticketId, req.body)
  res.success({
    result,
  })
})

router.get("/record/:recordId/details", async (req, res) => {
  const record = await getDetailsRsvpByRecordId(req.params.recordId)
  res.success({
    record,
  })
})

router
  .use(verifyToken(["ADMIN", "SUPERADMIN", "SEVA"]))
  .get("/management", async (req, res) => {
    const { date } = req.query
    const { records, summary } = await getRsvpByDate(date as string)
    res.success({
      records,
      rsvp: {
        id: summary.id,
        records: summary.records,
      },
    })
  })
  .put("/management/status", async (req, res) => {
    const { record, rsvp } = await handleChangeRecordStatus(req.body)
    res.success({
      record,
      rsvp,
    })
  })
  .post("/management/generate/days", async (req, res) => {
    const result = await generateDaysRsvp()
    res.success({
      result,
    })
  })

export { router }
