import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 100, default: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, 
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clerkId: { type: String, required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },


  paymentResult: {
    id: { type: String },
    status: { type: String },
    email: { type: String }
  },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "fulfilled", "cancelled"], default: "pending" },
  deliveredAt: { type: Date,  },
  shippedAt: { type: Date,  },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
