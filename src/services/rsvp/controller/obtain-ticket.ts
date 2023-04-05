import { Types } from "mongoose"
import { RsvpRecord } from "../model"

export async function getRsvpTicket(customerId: string) {
  const newTicket = new RsvpRecord()
  return newTicket
}
