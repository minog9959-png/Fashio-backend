import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
};

export default connectDB;
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB Error:", error);
//     throw error;
//   }
// };

// export default connectDB;