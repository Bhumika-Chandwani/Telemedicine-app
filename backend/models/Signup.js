import mongoose from "mongoose";

const Signup = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return (
            email.endsWith("@gmail.com") ||
            email.endsWith("@yahoo.com") ||
            email.endsWith("@outlook.com")
          );
        },
        message: props => `${props.value} is not a valid email!`,
      },
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"], // ✅ FIXED: added "admin"
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false, // only meaningful for doctors
    },
  },
  { timestamps: true }
);


export default mongoose.model("Signup", Signup, "users");