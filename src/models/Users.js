import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  personalemail: {
    type: String,
    required: [true, "Please provide an personalemail"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  Phone: {
    type: String,
    required: [true, "Please provide a Phone"],
  },
  Role: {
    type: String,
    required: [true, "Please provide a Role"],
  },
  PrentStaff: {
    type: String,
    required: [true, "Please provide a PrentStaff"],
  },

  Avatar: String,
  documents: String,
  onesignalPlayerId: {
    type: String,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.Users || mongoose.model("Users", UsersSchema);

export default User;


