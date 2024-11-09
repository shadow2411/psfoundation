import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

//@ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore

  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("db already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

// Tiffin Order Schema
const TiffinOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  region: { type: String, required: true },
  village: { type: String, required: true },
  fromDate: { type: Date, required: true },
  tillDate: { type: Date, required: true },
  lunchCount: { type: Number, default: 0 },
  dinnerCount: { type: Number, default: 0 },
  totalBill: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "received"],
    default: "pending",
  },
});

export const TiffinOrder =
  mongoose.models.TiffinOrder ||
  mongoose.model("TiffinOrder", TiffinOrderSchema);
