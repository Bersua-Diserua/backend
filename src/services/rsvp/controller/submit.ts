import { BadRequest, NotFound } from "@/packages/error"
import { RsvpRecord, rsvpRecordStatus, rsvpRecordValidator } from "../model"
import { sendGeneralText, sendGroupText } from "@/services/bot/controller/send"

import { obtainByDate } from "./rsvp-daily"

export async function submitReservation(
  ticketId: string,
  payload: TObjUnknown
) {
  const validated = rsvpRecordValidator.safeParse(payload)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })

  const ticket = await RsvpRecord.findById(ticketId)
  if (!ticket) throw new NotFound()

  const rsvpSummary = await obtainByDate(validated.data.date)

  const phoneNumber = parsePhoneNumber(validated.data.phoneNumber)

  const { seatIndex } = validated.data
  Object.assign(ticket, {
    ...validated.data,
    phoneNumber,
  })
  ticket.date = new Date(validated.data.date)
  ticket.status = "SUBMISSION"
  ticket.rsvpDailyId = rsvpSummary._id

  // Validate Seat
  const notAccessibleSeat =
    rsvpSummary.records.filter((x) => {
      const isExist = x.seat == seatIndex
      const notAccessible = [
        rsvpRecordStatus.Enum.RESOLVE,
        rsvpRecordStatus.Enum["SUBMISSION.APPROVE"],
        rsvpRecordStatus.Enum.SUBMISSION,
        // @ts-expect-error
      ].includes(x.status)
      return isExist && notAccessible
    }).length != 0

  if (notAccessibleSeat) throw new BadRequest("Seat already used")

  const onSubmission = rsvpSummary.records.find(
    (x) => x.recordId.toString() === ticket._id.toString()
  )
  if (onSubmission)
    throw new BadRequest("Already submitted with status: " + ticket.status)

  rsvpSummary.records.push({
    recordId: ticket._id,
    seat: ticket.seatIndex,
    status: rsvpRecordStatus.Enum.SUBMISSION,
  })

  await Promise.all([
    ticket.save(),
    rsvpSummary.save(),
    notifyCustomerRsvp(phoneNumber, ticketId),
    notifyGroupRsvp(),
  ])

  return ticket
}

export async function notifyCustomerRsvp(phone: string, ticketId: string) {
  const message =
    "Halo reservasi sukses, invoice berikut: https://rsvp.bersuadiserua.com/invoice/" +
    ticketId
  return sendGeneralText(phone, message)
}

export async function notifyGroupRsvp() {
  const message = "Ada reservasi baru dari Kawula Serua"
  return sendGroupText(message)
}

export function parsePhoneNumber(phone: string): string {
  if (phone.indexOf("6") === 0) {
    // start with 6, ex: 628xx
    return "62" + phone.substring(2)
  } else if (phone[0] === "8") {
    // start with 8, ex: (prefix 62) 81234
    return "62" + phone
  } else if (phone[0] === "0") {
    // start with 0, ex 081234
    return "62" + phone.substring(1)
  } else {
    return phone
  }
}
