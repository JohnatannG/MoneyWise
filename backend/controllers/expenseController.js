const Expense = require('../models/Expense');
const User = require('../models/User')

async function addExpense(req, res) {
    const { date, category, value } = req.body;

    if (!date || !category || !value) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const formattedDate = new Date(date); // Garante que a data seja convertida para um objeto Date
    if (isNaN(formattedDate.getTime())) {
        return res.status(400).json({ message: "Data inválida." });
    }

    try {
        const newExpense = new Expense({
            date: formattedDate,
            category,
            value,
            userId: req.user.id
        });

        await newExpense.save();

        // Atualiza o saldo do usuário
        const user = await User.findById(req.user.id);
        user.balance = user.balance - value;  // Atualiza o saldo subtraindo a despesa
        await user.save();

        res.status(201).json({ message: "Despesa registrada com sucesso!", expense: newExpense });
    } catch (error) {
        console.error("Erro ao salvar despesa:", error); // Log do erro no servidor
        res.status(500).json({ message: "Erro ao salvar despesa.", error: error.message });
    }
}


async function getExpenses(req, res) {
    try {
        const expenses = await Expense.find({ userId: req.user.id });

        const formattedExpenses = expenses.map(expense => ({
            ...expense.toObject(),
            date: expense.date.toISOString().split('T')[0],
        }));

        res.status(200).json(formattedExpenses);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar despesas', error });
    }
};


async function deleteExpense(req, res) {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: "Despesa não encontrada." });
        }
        res.status(200).json({ message: "Despesa excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir despesa.", error });
    }
}

async function updateExpense(req, res) {
    const { id } = req.params;
    const { date, category, value } = req.body;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, { date, category, value }, { new: true });
        if (!updatedExpense) return res.status(404).json({ message: "Despesa não encontrada." });
        res.status(200).json({ message: "Despesa atualizada com sucesso!", expense: updatedExpense });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar despesa.", error });
    }
}

async function getBalance(req, res) {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.value, 0);
        const balance = user.income - totalExpenses;

        res.status(200).json({ balance });
    } catch (error) {
        res.status(500).json({ message: "Erro ao calcular saldo", error });
    }
}

module.exports = { addExpense, getExpenses, deleteExpense, updateExpense, getBalance };
