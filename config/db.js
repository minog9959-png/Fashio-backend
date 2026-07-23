
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    isConnected = false;
    console.error("MongoDB Error:", error.message);
    throw error;
  }
};

export default connectDB;