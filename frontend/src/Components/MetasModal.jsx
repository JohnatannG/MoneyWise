import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import '../styles/MetasModal.css';

export default function MetasModal({ onClose }) {
    const [goals, setGoals] = useState([]);
    const [formGoal, setFormGoal] = useState({ name: '', target: '', invested: '' });
    const [editingGoal, setEditingGoal] = useState(null);

    useEffect(() => {
        fetchGoals();
        const interval = setInterval(fetchGoals, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/goals', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGoals(response.data);
        } catch (error) {
            console.error('Erro ao carregar as metas:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormGoal({ ...formGoal, [name]: value });
    };

    const handleAddOrEditGoal = async () => {
        if (!formGoal.name || !formGoal.target || !formGoal.invested) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        const goalData = { name: formGoal.name, target: formGoal.target, invested: formGoal.invested };

        try {
            const url = editingGoal
                ? `http://localhost:5000/api/goals/${editingGoal._id}`
                : 'http://localhost:5000/api/goals/';
            const method = editingGoal ? 'put' : 'post';
            const response = await axios[method](url, goalData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (editingGoal) {
                setGoals(goals.map(goal => goal._id === response.data._id ? response.data : goal));
            } else {
                setGoals([...goals, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar/editar meta:', error);
        }
    };

    const handleRemoveGoal = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/goals/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGoals(goals.filter(goal => goal._id !== id));
        } catch (error) {
            console.error('Erro ao excluir meta:', error);
        }
    };

    const editGoal = (goal) => {
        setEditingGoal(goal);
        setFormGoal({ name: goal.name, target: goal.target, invested: goal.invested });
    };

    const resetForm = () => {
        setFormGoal({ name: '', target: '', invested: '' });
        setEditingGoal(null);
    };

    return (
        <div className="MetasModal">
            <div className="ModalContentDespesasOrReceitas">
                <div className="ModalHeader">
                    <h3>Metas</h3>
                    <X size={24} onClick={onClose} />
                </div>
                <div className="ModalBody">
                    <div className="ScrollableTable">
                        <table className="MetasTable">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Meta</th>
                                    <th>Investido</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {goals.map((goal) => (
                                    <tr key={goal._id}>
                                        <td>{goal.name}</td>
                                        <td>R$ {goal.target}</td>
                                        <td>R$ {goal.invested}</td>
                                        <td className='gap-button-metas'>
                                            <button className="button-editar-metas" onClick={() => editGoal(goal)}>Editar</button>
                                            <button className="button-deletar-metas" onClick={() => handleRemoveGoal(goal._id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                    <form className="AddGoalForm">
                        <h4>{editingGoal ? 'Editar Meta' : 'Adicionar Meta'}</h4>
                        <input
                            name="name"
                            placeholder="Nome da meta"
                            value={formGoal.name}
                            onChange={handleInputChange}
                        />
                        <input
                            name="target"
                            placeholder="Valor da meta"
                            value={formGoal.target}
                            onChange={handleInputChange}
                        />
                        <input
                            name="invested"
                            placeholder="Investido até agora"
                            value={formGoal.invested}
                            onChange={handleInputChange}
                        />
                        <div className="button-style-form">
                            <button
                                type="button"
                                className="addicionarOrAtualizar"
                                onClick={handleAddOrEditGoal}
                            >
                                {editingGoal ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button
                                type="button"
                                className="Cancelar"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
}
