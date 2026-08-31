import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // Keep this temporarily for old users
    password: {
      type: String,
      required: false,
    },

    // Firebase UID
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    // Firebase Push Notification Token
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", formSchema);

export default Form;