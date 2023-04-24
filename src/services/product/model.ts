import { Schema, model } from "mongoose"

import { z } from "zod"

const DB_PRODUCT = "product"

/**
 * A for Active
 * D for Disable
 */

export const status = z.enum(["A", "D"])

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
    category: {
      type: Schema.Types.ObjectId,
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
    status: {
      type: String,
      enum: status.options,
      default: "A",
    },
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
  category: z.string().optional(),
  status: z.string().min(1),
})

const DB_CATEGORY = "category"

const category = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const Category = model(DB_CATEGORY, category, DB_CATEGORY)
