const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    category: { type: String, required: true },
    value: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

expenseSchema.set('toJSON', { getters: false });

module.exports = mongoose.model('Expense', expenseSchema);
