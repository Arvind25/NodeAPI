import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  role: {
    type: String,
    enum: ["editor", "admin", "manager"],
    required: true,
  },
  password: { type: String, required: true },

  // Add OTP fields
  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false }
});



adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error:any) {
    next(error);
  }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;