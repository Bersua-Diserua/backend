import { config, type SeatProps } from "../constant/seat"
import { obtainByDate } from "./rsvp-daily"

export async function seatAvailable(date: string) {
  const summary = await obtainByDate(date)
  const reserved = summary.records.reduce<number[]>((prev, curr) => {
    const { status } = curr
    if (
      status === "RESOLVE" ||
      status === "PAYMENT" ||
      status === "SUBMISSION.APPROVE"
    )
      return prev
    else return [...prev, curr.seat]
  }, [])

  const seats = config
    .reduce<SeatProps[]>((prev, curr) => {
      if (reserved.includes(curr.index)) {
        curr.status = "RESERVED"
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
