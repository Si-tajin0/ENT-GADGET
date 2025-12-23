import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // 'admin' or 'user'
  image: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);