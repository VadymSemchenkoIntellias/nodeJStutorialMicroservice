import mongoose from 'mongoose';

const RefreshToken = new mongoose.Schema({
    token: { type: String, required: true },
    expirationTime: { type: Number, required: true },
    userId: { type: String, required: true }
})

export default mongoose.model('RefreshToken', RefreshToken);