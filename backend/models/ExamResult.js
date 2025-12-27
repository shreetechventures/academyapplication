// models/ExamResult.js
const ExamResultSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  examId: mongoose.Schema.Types.ObjectId,
  score: Number,
  totalMarks: Number,
  percentage: Number,
  completedAt: Date, // 🔑 IMPORTANT
});

module.exports = mongoose.model("ExamResult", ExamResultSchema);
