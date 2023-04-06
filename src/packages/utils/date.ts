export function getDateWithoutTime(date: Date | string) {
  const parsed = new Date(date)

  return {
    day: parsed.getDate(),
    month: parsed.getMonth(),
    year: parsed.getFullYear(),
    iso: function (this) {
      return new Date(this.year, this.month, this.day)
    },
  }
}
