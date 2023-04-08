import { BadRequest, NotFound } from "@/packages/error"
import { RsvpRecord, rsvpRecordStatus, rsvpRecordValidator } from "../model"
import { getDateWithoutTime } from "@/packages/utils/date"
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

  const { seatIndex } = validated.data
  Object.assign(ticket, validated.data)
  ticket.date = new Date(validated.data.date)
  ticket.status = "SUBMISSION"

  const rsvpSummary = await obtainByDate(validated.data.date)

  // Validate Seat
  const notAccessibleSeat =
    rsvpSummary.records.filter((x) => {
      const isExist = x.seat == seatIndex
      const notAccessible = [
        rsvpRecordStatus.Enum.PAYMENT,
        rsvpRecordStatus.Enum.RESOLVE,
        rsvpRecordStatus.Enum["SUBMISSION.APPROVE"],
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

  await Promise.all([ticket.save(), rsvpSummary.save()])

  return ticket
}
