const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    value: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

revenueSchema.set('toJSON', { getters: false });

module.exports = mongoose.model('Revenue', revenueSchema);
