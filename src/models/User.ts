import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ldap: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  answers: [{
    questionId: String,
    selectedAnswer: String,
    isCorrect: Boolean,
    timeTaken: Number,
  }],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 