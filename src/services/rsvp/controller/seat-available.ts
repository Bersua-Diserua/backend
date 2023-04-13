import { config, type SeatProps } from "../constant/seat"
import { obtainByDate } from "./rsvp-daily"

export async function seatAvailable(date: string) {
  const summary = await obtainByDate(date)
  const reserved = summary.records.reduce<
    Record<SeatProps["status"], number[]>
  >(
    (prev, curr) => {
      const { status } = curr
      if (status === "SUBMISSION" || status === "SUBMISSION.APPROVE") {
        prev.HOLD.push(curr.seat)
      } else if (status === "REJECT" || status === "TICKET") {
        prev.OPEN.push(curr.seat)
      } else if (status === "RESOLVE") {
        prev.RESERVED.push(curr.seat)
      }
      return prev
    },
    {
      HOLD: [],
      OPEN: [],
      RESERVED: [],
      SELECTED: [],
    }
  )

  const seats = config
    .reduce<SeatProps[]>((prev, curr) => {
      if (reserved.RESERVED.includes(curr.index)) {
        curr.status = "RESERVED"
      } else if (reserved.HOLD.includes(curr.index)) {
        curr.status = "HOLD"
      } else {
        curr.status = "OPEN"
      }
      return [...prev, curr]
    }, [])
    .sort((a, b) => a.index - b.index)

  return {
    seats,
  }
}
