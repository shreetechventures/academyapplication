// /backend/models/AssessmentSchema.js
const AssessmentSchema = new mongoose.Schema({
  academyCode: String,
  studentId: String,
  testDate: Date,

  // MULTI TEST FIELDS
  hundredMeter: String,
  sixteenHundredMeter: String,
  pushups: Number,
  situps: Number,
  pullups: Number,
  longJump: String,
  highJump: String,
  shotput: String,
  writtenExam: Number,

}, { timestamps: true });
module.exports = mongoose.model("Assessment", AssessmentSchema);
