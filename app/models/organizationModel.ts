import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationType: {
    type: String,
    required: true,
  },
  loginCode: {
    type: String,
    required: true,
  },
  userCount: {
    type: String,
    required: true,
  },
  remainingUsers: {
    type: String,
    required: true,
  },
  demoDone: {
    type: Boolean,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
