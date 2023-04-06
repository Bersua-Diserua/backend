import { RsvpRecord } from "../model"

export async function submitReservation(
  ticketId: string,
  payload: TObjUnknown
) {
  const ticket = await RsvpRecord.findById(ticketId)
  return ticket
}
