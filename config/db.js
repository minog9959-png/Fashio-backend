import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("URI:", process.env.MONGO_URI);

//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("Full Error:");
//     console.error(error);
//     process.exit(1);
//   }
// };

// export default connectDB;