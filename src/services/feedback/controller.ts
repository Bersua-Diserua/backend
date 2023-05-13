import { BadRequest, NotFound } from "@/packages/error"
import { Feedback, feedBackSchema } from "./model"

export async function createTicket(customerId: string) {
  const ticket = new Feedback({
    customerId,
  })
  await ticket.save({
    validateBeforeSave: false,
  })

  return ticket
}

export async function updateFeedbackMessage(
  feedbackId: string,
  message: string
) {
  const feedback = await Feedback.findById(feedbackId)
  if (!feedback) throw new NotFound()

  const validateMessage = feedBackSchema.shape.message.safeParse(message)
  if (!validateMessage.success) throw new BadRequest()
  feedback.message = validateMessage.data

  return feedback.save()
}
