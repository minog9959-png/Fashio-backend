import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Firebase UID
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Keep this temporarily for old users
    password: {
      type: String,
      required: false,
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