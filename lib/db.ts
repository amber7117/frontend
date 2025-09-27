import mongoose from "mongoose";

// Extend the global object type to include mongoose
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  } | undefined;
}

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) throw new Error("Missing MONGO_URI");

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
