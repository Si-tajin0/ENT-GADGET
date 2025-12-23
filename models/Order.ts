import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  id: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  address: String,
  items: Array,
  total: Number,
  paymentMethod: String,
  txnId: String,
  status: { type: String, default: "Pending" }, // Pending, Approved, Delivered, Cancelled
  date: { type: String, default: new Date().toLocaleString() }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);