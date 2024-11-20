const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    target: { type: Number, required: true },
    invested: { type: Number, required: true },
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
