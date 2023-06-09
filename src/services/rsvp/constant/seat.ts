type SeatPosition =
  | {
      [key in "top" | "right" | "bottom" | "left"]?: number | undefined | string
    }
  | undefined

export type SeatProps = {
  position?: SeatPosition
  size?: "large" | "medium" | "small" | "long"
  index: number
  status: "OPEN" | "RESERVED" | "SELECTED" | "HOLD"
  capacity: {
    max: number
    min: number
  }
  isDisabled?: boolean
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
      max: 6,
      min: 3,
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
      max: 4,
      min: 2,
    },
    status: "RESERVED",
  },
  {
    position: {
      top: "3%",
      left: "36%",
    },
    index: 3,
    size: "small",
    capacity: {
      max: 4,
      min: 2,
    },
    status: "OPEN",
  },
  {
    position: {
      top: "3%",
      right: "36%",
    },
    index: 4,
    size: "small",
    capacity: {
      max: 4,
      min: 2,
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
      max: 4,
      min: 2,
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
    size: "medium",
    capacity: {
      max: 8,
      min: 4,
    },
    status: "OPEN",
  },
  {
    position: {
      bottom: "23%",
      right: "3%",
    },
    index: 8,
    size: "medium",
    capacity: {
      max: 8,
      min: 4,
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
      max: 4,
      min: 2,
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
      max: 4,
      min: 2,
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
      max: 8,
      min: 6,
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
      max: 8,
      min: 6,
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
      max: 3,
      min: 1,
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
      max: 3,
      min: 1,
    },
    status: "OPEN",
  },
  // {
  //   position: {
  //     bottom: "20%",
  //     right: "21%",
  //   },
  //   index: 17,
  //   size: "small",
  //   capacity: {
  //     max: 4,
  //     min: 2,
  //   },
  //   status: "OPEN",
  // },
]
