import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    submissionDate: {type: Date, required: true},
    status: {type: String, required: true},
    score: {type: Number, required: false, default: 0},
    problemTitle: {type: String, required: true},
    language: {type: String, required: false},
    code: {type: String, required: false},
    aiflag: {type: Boolean, required: false, default: false},
    runtime: {type: String, required: false, default: '0.00s'},
    memory: {type: String, required: false, default: '0.00MB'},
});

const submission = mongoose.model('submission', submissionSchema);

export default submission;