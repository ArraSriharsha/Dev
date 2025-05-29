import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const problemSchema = new mongoose.Schema({
  username: { type: String, required: false },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
  examples: [exampleSchema],
  constraints: [{ type: String, required: true }],
  testCasesInputPath: { type: String, required: false },
  testCasesOutputPath: { type: String, required: false },
  testCaseCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

const problem = mongoose.model('problem', problemSchema);
export default problem;
