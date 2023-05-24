import { BadRequest, NotFound } from "@/packages/error"
import {
  RSVP_RECORD_STATUS,
  RsvpDaily,
  RsvpRecord,
  rsvpRecordStatus,
} from "../../model"

import { parsePhoneNumber } from "../submit"
import { sendGeneralText } from "@/services/bot/controller/send"
import { z } from "zod"

const validator = z.object({
  recordId: z.string(),
  rsvpId: z.string(),
  status: rsvpRecordStatus,
  rejectedReason: z.string().nullable().optional(),
})

export async function handleChangeRecordStatus(payload: TObjUnknown) {
  const validated = validator.safeParse(payload)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })

  const { rsvpId, recordId, status, rejectedReason } = validated.data
  const dailyRsvp = await RsvpDaily.findById(rsvpId)
  if (!dailyRsvp) throw new NotFound("Rsvp Daily not found")

  const record = await RsvpRecord.findById(recordId)
  if (!record) throw new NotFound("Record not found")

  const idx = dailyRsvp.records.findIndex(
    (x) => x.recordId.toString() == recordId
  )
  if (idx < 0) throw new NotFound()

  if (status === "REJECT") {
    if (!rejectedReason) {
      throw new BadRequest("Rejected reason is required")
    } else {
      record.rejectedReason = rejectedReason
    }
  }

  // Date transaction was resolved
  if (status === "RESOLVE") {
    record.transaction.date = new Date()
  }

  dailyRsvp.records[idx].status = status
  record.status = status

  await Promise.all([
    dailyRsvp.save(),
    record.save(),
    notifyCustomerStatusUpdated(
      status,
      parsePhoneNumber(record.phoneNumber),
      recordId,
      record.rejectedReason
    ),
  ])

  return {
    rsvp: dailyRsvp.toJSON(),
    record: record.toJSON(),
  }
}

async function notifyCustomerStatusUpdated(
  status: RSVP_RECORD_STATUS,
  phone: string,
  invoiceId: string,
  reason: string
) {
  // RESOLVE SUBMISSION.APPROVE REJECT
  const invoice =
    "\n\nInvoice: https://rsvp.bersuadiserua.com/invoice/" + invoiceId
  let msg
  switch (status) {
    case "RESOLVE":
      msg = "Reservasi telah berhasil, mohon untuk datang tepat waktu."
      break
    case "SUBMISSION.APPROVE":
      msg =
        "Reservasi telah disetujui, mohon untuk melakukan FULL PAYMENT TRANSFER melalui QRIS yg tertera di link invoice dan kirimkan screenshoot bukti transfer kesini ya."
      break
    case "REJECT":
      msg = "Reservasi ditolak karena " + reason
      break
    default:
      break
  }

  return msg && (await sendGeneralText(phone, msg + invoice))
}
