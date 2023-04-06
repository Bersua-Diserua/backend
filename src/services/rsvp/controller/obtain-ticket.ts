import { Types } from "mongoose"
import { RsvpRecord } from "../model"
import { customerStore } from "@/services/customer/controller/customer-store"
import { NotFound } from "@/packages/error"

export async function getNewRsvpTicket(phoneNumber: string) {
  const cust = await customerStore.obtainByPhone(phoneNumber)

  const newTicket = new RsvpRecord()
  newTicket.customerId = new Types.ObjectId(cust.id)

  return newTicket.save({
    validateBeforeSave: false,
  })
}

export async function obtainTicket(ticketId: string) {
  const ticket = await RsvpRecord.findById(ticketId)
  if (!ticket) throw new NotFound()
  return ticket
}
