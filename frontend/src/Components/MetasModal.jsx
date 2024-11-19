import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/MetasModal.css';

export default function MetasModal({ onClose }) {
    const [goals, setGoals] = useState([]);
    const [formGoal, setFormGoal] = useState({
        name: '',
        target: '',
        invested: '',
    });
    const [editingGoal, setEditingGoal] = useState(null);

    useEffect(() => {
        const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
        setGoals(savedGoals);
    }, []);

    useEffect(() => {
        if (goals.length > 0) {
            localStorage.setItem('goals', JSON.stringify(goals));
        }
    }, [goals]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormGoal({ ...formGoal, [name]: value });
    };

    const handleAddOrEditGoal = () => {
        if (!formGoal.name || !formGoal.target || !formGoal.invested) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        if (editingGoal) {
            setGoals(goals.map(goal => goal === editingGoal ? formGoal : goal));
        } else {
            setGoals([...goals, formGoal]);
        }
        
        resetForm();
    };

    const handleRemoveGoal = (goalToRemove) => {
        setGoals(goals.filter(goal => goal !== goalToRemove));
    };

    const editGoal = (goal) => {
        setEditingGoal(goal);
        setFormGoal(goal);
    };

    const resetForm = () => {
        setFormGoal({ name: '', target: '', invested: '' });
        setEditingGoal(null);
    };

    return (
        <div className="MetasModal">
            <div className="ModalContent">
                <div className="ModalHeader">
                    <span>Metas</span>
                    <X size={24} onClick={onClose} />
                </div>
                <div className="ModalBody">
                    <h3>Todas as Metas</h3>
                    <table className="GoalsTable">
                        <thead>
                            <tr>
                                <th>Nome da Meta</th>
                                <th>Meta (R$)</th>
                                <th>Valor Investido (R$)</th>
                                <th>Progresso (%)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((goal, index) => (
                                <tr key={index}>
                                    <td>{goal.name}</td>
                                    <td>{goal.target}</td>
                                    <td>{goal.invested}</td>
                                    <td>
                                        {Math.min(
                                            ((parseFloat(goal.invested) / parseFloat(goal.target)) * 100).toFixed(2),
                                            100
                                        )}%
                                    </td>
                                    <td>
                                        <button className="edit" onClick={() => editGoal(goal)}>Editar</button>
                                        <button className="delete" onClick={() => handleRemoveGoal(goal)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="AddGoalForm">
                        <h4>{editingGoal ? 'Editar Meta' : 'Adicionar Meta'}</h4>
                        <input type="text" name="name" placeholder="Nome da Meta" value={formGoal.name} onChange={handleInputChange} />
                        <input type="number" name="target" placeholder="Meta (R$)" value={formGoal.target} onChange={handleInputChange} />
                        <input type="number" name="invested" placeholder="Valor Investido (R$)" value={formGoal.invested} onChange={handleInputChange} />
                        <button onClick={handleAddOrEditGoal}>{editingGoal ? 'Atualizar' : 'Adicionar'}</button>
                        <button onClick={resetForm}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
