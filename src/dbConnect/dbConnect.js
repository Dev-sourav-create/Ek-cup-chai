import mongoose from "mongoose";

const MONGODB_URI = process.env.MongoDbURL;

if (!MONGODB_URI) {
  throw new Error("Please define MongoDbURL in .env");
}

// 👇 Global cache (VERY IMPORTANT for Next.js hot reload)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  // ✅ If already connected, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // ✅ Create connection only once
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("db connected");
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
