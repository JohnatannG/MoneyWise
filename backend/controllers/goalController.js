const Goal = require('../models/Goal');
const User = require('../models/User');

// Adicionar uma nova meta
const Goal = require('../models/Goal');
const User = require('../models/User');

// Adicionar uma nova meta
async function addGoal(req, res) {
    const { name, target } = req.body;

    // Verifica se os campos obrigatórios estão presentes
    if (!name || !target) {
        return res.status(400).json({ message: "Nome e alvo são obrigatórios." });
    }

    // Valida se o valor do alvo é maior que 0
    if (target <= 0) {
        return res.status(400).json({ message: "O alvo deve ser um valor maior que 0." });
    }

    try {
        // Criação de uma nova meta
        const newGoal = new Goal({
            name,
            target,
            userId: req.user.id,
        });

        await newGoal.save();  // Salva a meta no banco de dados

        // Resposta com sucesso
        res.status(201).json({ message: "Meta criada com sucesso!", goal: newGoal });
    } catch (error) {
        console.error("Erro ao salvar meta:", error);  // Log de erro
        res.status(500).json({ message: "Erro ao salvar meta.", error: error.message });
    }
}

// Buscar todas as metas do usuário
async function getGoals(req, res) {
    // Verifica se o usuário está autenticado
    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "Usuário não autenticado." });
    }
    
    try {
        // Busca as metas associadas ao usuário
        const goals = await Goal.find({ userId: req.user.id });

        // Verifica se o usuário tem metas
        if (!goals || goals.length === 0) {
            return res.status(404).json({ message: "Nenhuma meta encontrada." });
        }

        // Retorna as metas encontradas
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar metas.", error });
    }
}

// Atualizar uma meta
async function updateGoal(req, res) {
    const { id } = req.params;
    const { name, target, invested } = req.body;

    try {
        // Atualiza a meta com os novos dados
        const updatedGoal = await Goal.findByIdAndUpdate(
            id,
            { name, target, invested },
            { new: true }  // Retorna a meta atualizada
        );

        // Verifica se a meta foi encontrada
        if (!updatedGoal) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }

        // Retorna a meta atualizada
        res.status(200).json({ message: "Meta atualizada com sucesso!", goal: updatedGoal });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar meta.", error });
    }
}

// Deletar uma meta
async function deleteGoal(req, res) {
    try {
        const { id } = req.params;

        // Exclui a meta com o ID fornecido
        const goal = await Goal.findByIdAndDelete(id);

        // Verifica se a meta foi encontrada
        if (!goal) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }

        // Resposta com sucesso
        res.status(200).json({ message: "Meta excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir meta.", error });
    }
}

module.exports = { addGoal, getGoals, updateGoal, deleteGoal };


// Buscar todas as metas do usuário
async function getGoals(req, res) {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "Usuário não autenticado." });
    }
    
    try {
        const goals = await Goal.find({ userId: req.user.id });

        if (!goals || goals.length === 0) {
            return res.status(404).json({ message: "Nenhuma meta encontrada." });
        }

        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar metas.", error });
    }
}



// Atualizar uma meta
async function updateGoal(req, res) {
    const { id } = req.params;
    const { name, target, invested } = req.body;

    try {
        const updatedGoal = await Goal.findByIdAndUpdate(
            id,
            { name, target, invested },
            { new: true }
        );

        if (!updatedGoal) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }

        res.status(200).json({ message: "Meta atualizada com sucesso!", goal: updatedGoal });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar meta.", error });
    }
}

// Deletar uma meta
async function deleteGoal(req, res) {
    try {
        const { id } = req.params;
        const goal = await Goal.findByIdAndDelete(id);
        if (!goal) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }
        res.status(200).json({ message: "Meta excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir meta.", error });
    }
}

module.exports = { addGoal, getGoals, updateGoal, deleteGoal };
