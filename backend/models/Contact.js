const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    agree: { type: Boolean, default: false },
    status: { type: String, enum: ["new", "read", "closed"], default: "new" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);