import { Types } from "mongoose"
import { RsvpRecord } from "../model"
import { customerStore } from "@/services/customer/controller/customer-store"

export async function getRsvpTicket(phoneNumber: string) {
  const cust = await customerStore.obtainByPhone(phoneNumber)

  const newTicket = new RsvpRecord()
  newTicket.customerId = new Types.ObjectId(cust.id)
  return newTicket.save({
    validateBeforeSave: false,
  })
}

export async function obtainTicket(ticketId: string) {
  const ticket = await RsvpRecord.findById(ticketId)
  return ticket
}
