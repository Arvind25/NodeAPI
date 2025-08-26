import mongoose, { Number } from "mongoose";
import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken"
import globalConfig from "../config";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    Name: { type: String },
    organizationCode: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId,ref: "Organization"},
    signedUpFor: { type: String },
    code: { type: String },
    webUrl: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    usertype: { type: String, default: "self" },
    password: { type: String, required: true}, // ,select :false means when we get user it will not apeear in data
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    caseStudy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    isSubscribed: { type: Boolean, default: false },
    consultations: [
      {
        expert: { type: mongoose.Schema.Types.ObjectId, ref: "Expert" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "ExpertBooking" },
        sessionType: { type: String },
        date: { type: Date },
        time: { type: String },
        name: { type: String },
      }
    ],
    paymentDetails: [
      {
        hasPaid: { type: Boolean },
        paymentDate: { type: Date },
        paymentMethod: { type: String },
        paymentTransactionId: { type: String },
        paymentAmount: { type: Number },
        planType: { type: String },
        hasExpired: { type: Boolean },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      },
    ],
    expertSupport: {
      supportType: {
        type: String,
        enum: [
          "Anxiety or Stress Management",
          "Depression",
          "Relationship Issues",
          "Personal Growth and Well-Being",
          "Career Counseling",
          "Other",
        ],
      },
      therapistSpecialization: { type: String, required: false },
      sessionFormat: { type: String, enum: ["In-person", "Virtual", "Both"],},
      preferredDays: { weekdays: { type: [String] }, weekends: { type: [String] }},
      genderPreference: {
        type: String,
        enum: ["No preference", "Female", "Male"],
      },
      culturalExpertise: { type: String, required: false },
      budgetPerSession: {
        type: Number,
        enum: [1000, 3000, 5000, null],
      },
    },
    mentalWellBeing: {
      currentGoal: {
        type: String,
        enum: [
          "Reducing Stress",
          "Improving Focus and Mental Clarity",
          "Building Emotional Resilience",
          "Overcoming Anxiety",
          "General Well-Being",
        ],
      },
      familiarityLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
      },
      programType: {
        type: String,
        enum: ["Self-paced", "Group sessions", "One-on-one session", "Hybrid"],
      },
      timeCommitment: {
        type: String,
        enum: ["1-2 Weeks", "1 Month", "3 Months", "6 Months or More"],
      },
      accessToLiveSessions: { type: Boolean },
      progressTracking: { type: Boolean },
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    professionalCourse: {
      goalForEnrollment: {
        type: String,
        enum: ["Career Change", "Professional Development", "Personal Growth"],
      },
      useForCareer: { type: Boolean },
      courseAreaOfInterest: {
        type: String,
        enum: [
          "Clinical Psychology",
          "Counseling and Therapy",
          "Mental Health Research",
          "Child Psychology",
          "Organizational Psychology",
          "General Mental Health Awareness",
        ],
      },
      learningFormat: {
        type: String,
        enum: ["Online", "Hybrid", "In-person"],
      },
      includesPracticalExperience: { type: Boolean },
      courseStartTime: {
        type: String,
        enum: ["Immediately", "Within 1 month", "Within 3 months"],
      },
    },
    employeecaseTakingCompleted: { type: Boolean, default: false },
    employeeassessmentCompleted: { type: Boolean, default: false },
    studentSchoolCaseTakingCompleted: { type: Boolean, default: false },
    studentCollegeCaseTakingCompleted: { type: Boolean, default: false },
    studentAssessmentStatus: {
      type: Map,
      of: Boolean,
      default: {
        "Test Anxiety": false,
        "Intelligence Level (minor)": false,
        "Aptitude": false,
        "Stress": false,
        "Personality": false,
        "Subjective Wellbeing": false
      }
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    selfAssessmentStatus: {
      type: Map,
      of: new mongoose.Schema({
        hasPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        caseTakingCompleted: { type: Boolean, default: false },
        assessmentCompleted: { type: Boolean, default: false }
      }),
      default: {}
    },
    usedCoupons: [
      {
        category: String,
        couponCode: String,
        endDate: Date,
      }
    ],

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generateJWT = async function() {
    const jwtPayload = {
      userId:this._id.toString(),
      email:this.email
    };
    //const secret:any = globalConfig.JWT_SECRET ;
    //const expireDuration:any = globalConfig.TOKEN_EXPIRATION
    const payload = { userId: this._id.toString(), username: this.email };
    const token = await jwt.sign(jwtPayload, globalConfig.JWT_SECRET, { expiresIn:globalConfig.TOKEN_EXPIRATION }); // Token expires in 1 hour
    return token;
}

userSchema.methods.comparePassword = async function (userPassword:string)  {
    return await bcrypt.compare(userPassword.trim(), this.password);
};

//const User = mongoose.model("User", userSchema);

export default mongoose.model("User", userSchema);
