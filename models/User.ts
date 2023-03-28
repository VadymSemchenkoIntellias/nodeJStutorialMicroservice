import mongoose from 'mongoose';

const User = new mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true }
})

export default mongoose.model('User', User);
