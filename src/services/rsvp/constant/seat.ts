type SeatPosition =
  | {
      [key in "top" | "right" | "bottom" | "left"]?: number | undefined | string
    }
  | undefined

export type SeatProps = {
  position?: SeatPosition
  size?: "large" | "medium" | "small" | "long"
  index: number
  status: "OPEN" | "RESERVED" | "SELECTED"
  capacity: {
    max: number
    min: number
  }
}

export const config: SeatProps[] = [
  {
    position: {
      top: "3%",
      left: "3%",
    },
    index: 1,
    size: "medium",
    capacity: {
      max: 10,
      min: 1,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "3%",
      left: "18%",
    },
    index: 2,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "RESERVED",
  },
  {
    position: {
      top: "3%",
      left: "33%",
    },
    index: 3,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "3%",
      right: "33%",
    },
    index: 4,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "3%",
      right: "18%",
    },
    index: 5,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "3%",
      right: "3%",
    },
    index: 6,
    size: "medium",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "23%",
      right: "3%",
    },
    index: 7,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "23%",
      right: "3%",
    },
    index: 8,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "3%",
      right: "3%",
    },
    index: 9,
    size: "medium",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "3%",
      left: "3%",
    },
    index: 10,
    size: "medium",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "23%",
      left: "3%",
    },
    index: 11,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "23%",
      left: "3%",
    },
    index: 12,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "28%",
      left: "22%",
    },
    index: 13,
    size: "large",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "28%",
      right: "22%",
    },
    index: 14,
    size: "large",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "-1%",
      left: "22%",
    },
    index: 15,
    size: "long",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "-1%",
      right: "22%",
    },
    index: 16,
    size: "long",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "20%",
      right: "21%",
    },
    index: 17,
    size: "small",
    capacity: {
      max: 6,
      min: 3,
    },
    status: "OPEN",
  },
]
