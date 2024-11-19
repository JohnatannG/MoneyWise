const Revenue = require('../models/Revenue');
const User = require('../models/User');

async function addRevenue(req, res) {
    const { date, category, value } = req.body;

    if (!date || !category || !value) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
        return res.status(400).json({ message: "Data inválida." });
    }

    try {
        const newRevenue = new Revenue({
            date: formattedDate,
            category,
            value,
            userId: req.user.id
        });

        await newRevenue.save();

        
        const user = await User.findById(req.user.id);
        user.balance = user.balance + value;
        await user.save();

        res.status(201).json({ message: "Receita registrada com sucesso!", revenue: newRevenue });
    } catch (error) {
        console.error("Erro ao salvar receita:", error);
        res.status(500).json({ message: "Erro ao salvar receita.", error: error.message });
    }
}

async function getRevenues(req, res) {
    try {
        const revenues = await Revenue.find({ userId: req.user.id });

        const formattedRevenues = revenues.map(revenue => ({
            ...revenue.toObject(),
            date: revenue.date.toISOString().split('T')[0],
        }));

        res.status(200).json(formattedRevenues);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar receitas.', error });
    }
}


async function deleteRevenue(req, res) {
    try {
        const { id } = req.params;
        const revenue = await Revenue.findByIdAndDelete(id);
        if (!revenue) {
            return res.status(404).json({ message: "Receita não encontrada." });
        }
        res.status(200).json({ message: "Receita excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir receita.", error });
    }
}

async function updateRevenue(req, res) {
    const { id } = req.params;
    const { date, category, value } = req.body;

    try {
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: "Data inválida." });
        }

        const updatedRevenue = await Revenue.findByIdAndUpdate(
            id,
            { date: formattedDate, category, value },
            { new: true }
        );

        if (!updatedRevenue) {
            return res.status(404).json({ message: "Receita não encontrada." });
        }
        res.status(200).json({ message: "Receita atualizada com sucesso!", revenue: updatedRevenue });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar receita.", error });
    }
}

module.exports = { addRevenue, getRevenues, deleteRevenue, updateRevenue };
