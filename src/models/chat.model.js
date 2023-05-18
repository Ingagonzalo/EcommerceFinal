import { model, Schema } from "mongoose";

const chatSchema = Schema({
  username: { type: String },
  message: { type: String },
  time: { type: String },
  type: { type: String },
});

export const Chat = model("chat", chatSchema);
