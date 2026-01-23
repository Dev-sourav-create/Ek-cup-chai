import mongoose, { Connection, connection } from "mongoose";

async function dbConnect() {
  try {
    mongoose.connect(process.env.MongoDbURL);

    connection.on("connected", () => {
      console.log("db connected");
    });
    connection.on("error", (err) => {
      console.log("MongoDb connection error" + err);
      process.exit;
    });
  } catch (error) {
    console.log("Something went wrong with Db Connection");
    console.error(error);
  }
}

export default dbConnect;
