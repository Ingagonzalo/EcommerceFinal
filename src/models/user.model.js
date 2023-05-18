import { model, Schema } from "mongoose";

// modelo schema de mongodb
const userSchema = Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  phone: { type: Number },
  address: { type: String },
  age: { type: Number },
  photo: { type: String },
  admin: { type: Boolean },
});

export const User = model("user", userSchema);
