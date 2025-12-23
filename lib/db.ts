import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "entgadget", // আপনার ডাটাবেস নাম
      bufferCommands: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw new Error("Error connecting to MongoDB");
  }
};

export default connectDB;