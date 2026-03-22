const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
    },
 
 
    // Role
    role: { type: String, enum: ['worker', 'client', 'both'], default: 'both' },
 
    // Worker info
    skills: [{ type: String }],
    location: { type: String, default: '' },
    availability: {
        mon: { type: String, default: '-' },
        tue: { type: String, default: '-' },
        wed: { type: String, default: '-' },
        thu: { type: String, default: '-' },
        fri: { type: String, default: '-' },
        sat: { type: String, default: '-' },
        sun: { type: String, default: '-' },
    },
 
    // Worker records
    jobsDone: { type: Number, default: 0 },
    workerRating: { type: Number, default: 0 },
    jobCompletion: { type: Number, default: 0 },
 
    // Client records
    jobsPosted: { type: Number, default: 0 },
    clientRating: { type: Number, default: 0 },
    transactionCompletion: { type: Number, default: 0 },
});
 
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});
 
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
 
 
module.exports = mongoose.model('User', userSchema);