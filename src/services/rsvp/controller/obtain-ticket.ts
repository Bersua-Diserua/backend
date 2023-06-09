import { NotFound } from "@/packages/error"
import { RsvpRecord } from "../model"
import { Types } from "mongoose"
import { customerStore } from "@/services/customer/controller/customer-store"

export async function getNewRsvpTicket(phoneNumber: string) {
  const cust = await customerStore.obtainByPhone(phoneNumber)

  const newTicket = new RsvpRecord()
  newTicket.customerId = new Types.ObjectId(cust.id)
  newTicket.phoneNumber = phoneNumber

  return newTicket.save({
    validateBeforeSave: false,
  })
}

export async function getNewRsvpTicketByGuest() {
  const newTicket = new RsvpRecord()
  return newTicket.save({ validateBeforeSave: false })
}

export async function obtainTicket(ticketId: string) {
  const ticket = await RsvpRecord.findById(ticketId)
  if (!ticket) throw new NotFound()
  return ticket
}
