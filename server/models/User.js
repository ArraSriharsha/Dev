import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
   FirstName: {type: String, required: true},
   LastName: {type: String, required: true},
   Email: {type: String, required: true, unique: true},
   Username: {type: String, required: true, unique: true},
   Password: {type: String, required: true},
   PhoneNumber: {type: String, required: true},
   Role: {type: String, required: false, default: 'User'}
   });
userSchema.set('timestamps', true);
const user = mongoose.model('user', userSchema);

export default user;