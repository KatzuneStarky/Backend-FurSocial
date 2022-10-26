import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.URI_MONGO);
  console.log("Connection to database sucesfully");
} catch (error) {
  console.log("Database connection error to MongoDB: " + error);
}