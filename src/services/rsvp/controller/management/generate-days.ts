import { RsvpDaily } from "../../model"

export async function generateDaysRsvp() {
  const days = 40

  const generated = [...new Array(days)].map((_, idx) => {
    const date = new Date()
    date.setDate(date.getDate() + idx)
    return new RsvpDaily({
      date: date,
      records: [],
    })
  })

  return RsvpDaily.bulkSave(generated)
}
