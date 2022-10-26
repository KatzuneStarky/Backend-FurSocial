import mongoose from "mongoose";
const { Model, Schema } = mongoose;

const userSchema = new Schema ({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: { unique: true }
  }, 
  password: {
    type: String,
    required: true
  }
});

export const  User = Model('user', userSchema);