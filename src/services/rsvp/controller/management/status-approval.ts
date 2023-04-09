import { z } from "zod"
import { RsvpDaily, RsvpRecord, rsvpRecordStatus } from "../../model"
import { BadRequest, NotFound } from "@/packages/error"

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

  dailyRsvp.records[idx].status = status
  record.status = status

  await Promise.all([dailyRsvp.save(), record.save()])

  return {
    rsvp: dailyRsvp.toJSON(),
    record: record.toJSON(),
  }
}
