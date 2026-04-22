import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    phone: { type: String, default: null },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
      unique: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true, 
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

    dob: { type: Date, default: null},
    gender: { type: String, default: null },
    phone: { type: String, default: null},
    profilePhoto: { type: String, default: null},
    bloodGroup: { type: String, default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    hasChronicDisease: { type: Boolean, default: null},
    chronicDiseaseDetail: { type: String, default: null },
    predictionDetail: { type: String, default: null, optional: true },
    emergencyContact: { type: emergencyContactSchema, default: null, optional: true  },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema, "patients");
