import { model, Schema } from "mongoose";

const DB_MENU = "menu";

const menu = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: new Schema({
        amount: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
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
);

export const Menu = model(DB_MENU, menu, DB_MENU);
