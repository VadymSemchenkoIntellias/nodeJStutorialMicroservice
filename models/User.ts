import mongoose from 'mongoose';
import axios from 'axios';


const User = new mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    company: { type: String, required: true },
    name: { type: String, required: true }
});

export default mongoose.model('User', User);
