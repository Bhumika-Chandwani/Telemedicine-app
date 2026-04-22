import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    startTime: String,
    endTime: String,
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    day: String,
    slots: [slotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
      unique: true,
    },

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

    phone: { type: String, default: null },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, default: null },
    bio: { type: String, default: null },

    languagesSpoken: { type: [String], default: [] },

    availability: { type: [availabilitySchema], default: [] },

    breakTime: {
      startTime: { type: String, default: null },
      endTime: { type: String, default: null },
    },

    profilePhoto: { type: String, required: true },
    medicalLicense: { type: String, required: true },
    identityProof: { type: String, required: true },

    isVerified: { type: Boolean, default: false },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema, "doctors");
