import { Schema, model } from "mongoose";

const date = new Date();

const cartSchema = new Schema({
  timestamp: { type: Date, default: date.toUTCString() },
  products: [
    {
      quantity: { type: Number, default: 1 },
      title: { type: String },
      thumbnail: { type: String },
      price: { type: Number },
      category: { type: String },
    },
  ],
  username: { type: String },
  address: { type: String },
  email: { type: String },
});

export const Cart = model("cart", cartSchema);
