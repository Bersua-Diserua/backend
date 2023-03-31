import { model, Schema } from "mongoose"
import { z } from "zod"

const DB_PRODUCT = "product"

const product = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
      default: null,
    },
    price: {
      type: new Schema({
        amount: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: false,
          default: "Porsi",
        },
      }),
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        required: true,
      },
    ],
  },
  { timestamps: true }
)

export const Product = model(DB_PRODUCT, product, DB_PRODUCT)

export const productValidator = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  price: z.object({
    amount: z.number(),
    unit: z.string().catch("Porsi"),
  }),
  images: z.array(z.string()).min(1),
})
