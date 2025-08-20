
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const ReviewSchema = new mongoose.Schema(
  {
    recommendDoctor: Boolean,
    treatmentTaken: String,
    duration: {
      type: String,
      enum: [
        "Less than 15 min",
        "15 min to 30 min",
        "30 min to 1 hour",
        "More than 1 hour",
      ],
    },
    roomForImprovement: {
      type: [String],
      enum: [
        "Doctor friendliness",
        "Explanation of the health issue",
        "Treatment satisfaction",
        "Value for money",
        "Wait time",
      ],
    },
    review: String,
    reply: { type: String, default: "" },
    image: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isApproved: { type: Boolean, default: false },
    userName: String,
    userEmail: String,
  },
  { timestamps: true }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true, unique: true },
    userType: { type: String, required: true },
    usertype: { type: String, default: "expert" },
    password: { type: String, required: true, select: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    image: { type: String, required: false },
    coverPhoto: { type: String, default: "shareyrheart_template.jpg" },
    about: { type: String },
    clinicAddress: { type: String },
    fees: { type: Number, default: 0 },
    education: [
      {
        school: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    registeredNumber: { type: String },
    experience: [
      {
        title: { type: String },
        employmentType: { type: String },
        companyOrOrganization: { type: String },
        isSelfEmployed: { type: Boolean, default: false },
        startDate: { type: Date },
        endDate: { type: Date },
        location: { type: String },
        description: { type: String },
        isPresent: { type: Boolean, default: false },
      },
    ],
    internships: [
      {
        companyOrOrganization: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        location: { type: String },
        description: { type: String },
      },
    ],
    careerBreak: [
      {
        type: { type: String },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    specialization: [String],
    services: [String],
    therapies: [String],
    licensesAndCertificates: [
      {
        name: { type: String },
        issuingOrganization: { type: String },
        issueDate: { type: Date },
        expirationDate: { type: Date },
        credentialId: { type: String },
        licensesAndCertificatesImage: { type: String },
      },
    ],
    journals: [
      {
        caseName: { type: String },
        // journalImage: { type: String },
        location: { type: String },
        date: { type: Date },
        description: { type: String },
      },
    ],
    courses: [
      {
        courseName: { type: String },
        fieldOfCourse: { type: String },
        duration: { type: String },
        // startDate: { type: Date },
        // endDate: { type: Date },
      },
    ],
    fellowship: [
      {
        fieldOfFellowship: { type: String },
        yearOfAttaining: { type: Number },
      },
    ],
    recommendations: [
      {
        content: { type: String },
        // recommendationsImage: { type: String },
        link: { type: String },
      },
    ],

    volunteerExperience: [
      {
        type: { type: String },
        companyOrOrganization: { type: String },
        // isSelf: { type: Boolean, default: false },
        startDate: { type: Date },
        endDate: { type: Date },
        location: { type: String },
        description: { type: String },
      },
    ],
    mediaAndPublications: [
      {
        title: { type: String },
        publisher: { type: String },
        date: { type: Date },
        url: { type: String },
        description: { type: String },
        mediaAndPublicationsImage: { type: String },
      },
    ],
    honorsAndAwards: [
      {
        title: { type: String },
        issuer: { type: String },
        issueDate: { type: Date },
        description: { type: String },
        honorsAndAwardsImage: { type: String },
      },
    ],
    languages: [String],

    walletBalance: { type: Number, default: 0 },
    hasPackage: { type: Boolean, default: false },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "expertPackages" },

    // NEW fields for package tracking
    packageStartDate: { type: Date },
    packageExpiryDate: { type: Date },
    creditsRemaining: { type: Number, default: 0 },

    isProfileVerified: { type: Boolean },
    verifyPhone: { type: Boolean },
    verifyEmail: { type: Boolean },
    paymentDetails: {
      hasPaid: { type: Boolean, default: false },
      paymentDate: { type: Date },
      paymentMethod: { type: String },
      paymentTransactionId: { type: String },
      paymentAmount: { type: Number },
      planType: { type: String }, // Add this
      couponCode: { type: String }, // Add this
      hasExpired: { type: Boolean, default: false },
    },
    reviews: [ReviewSchema],
    generalQuestions: [
      { question: { type: String }, answer: { type: String, trim: true } },
    ],
    consultations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "consultations" },
    ],
    isArchived: { type: Boolean, default: false },
    dateOfBirth: { type: Date, required: false },
  },
  { timestamps: true }
);

expertSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


expertSchema.methods.comparePassword = async function (password:string) {
  return await bcrypt.compare(password, this.password);
};

const Expert = mongoose.model("Expert", expertSchema);

export default Expert;
