export function getDateWithoutTime(date: Date | string) {
  console.log({
    before: date,
  })

  const parsed = new Date(date)
  console.log({
    after: parsed.toISOString(),
  })

  return {
    day: parsed.getDate(),
    month: parsed.getMonth(),
    year: parsed.getFullYear(),
    iso: function (this) {
      return new Date(this.year, this.month, this.day)
    },
  }
}

export function getRangeInOneDay(date: Date) {
  const endDate = new Date(date)

  return {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
  }
}
