const Goal = require('../models/goalModel');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar metas.' });
    }
};

exports.addGoal = async (req, res) => {
    const { name, target, invested } = req.body;

    if (!name || !target || !invested) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const goal = new Goal({ user: req.user._id, name, target, invested });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar meta.' });
    }
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const { name, target, invested } = req.body;

    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { name, target, invested },
            { new: true }
        );

        if (!goal) return res.status(404).json({ message: 'Meta não encontrada.' });

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar meta.' });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await Goal.findOneAndDelete({ _id: id, user: req.user._id });

        if (!goal) return res.status(404).json({ message: 'Meta não encontrada.' });

        res.status(200).json({ message: 'Meta removida com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover meta.' });
    }
};
