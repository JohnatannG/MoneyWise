import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import '../styles/DespesasModal.css';

export default function DespesasModal({ onClose }) {
    const [expenses, setExpenses] = useState([]);
    const [formExpense, setFormExpense] = useState({
        date: '',
        category: '',
        value: '',
    });
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log('Despesas recebidas:', response.data);
            setExpenses(response.data);
        } catch (error) {
            console.error('Erro ao carregar as despesas:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormExpense({ ...formExpense, [name]: value });
    };

    const handleAddOrEditExpense = async () => {
        try {
            const formattedDate = new Date(formExpense.date);
            if (formattedDate instanceof Date && !isNaN(formattedDate)) {
                formExpense.date = formattedDate.toISOString().split('T')[0];
            } else {
                formExpense.date = '';
                alert('Data inválida!');
                return;
            }

            if (!formExpense.category || !formExpense.value) {
                alert('Todos os campos são obrigatórios!');
                return;
            }
    
            const url = editingExpense
                ? `http://localhost:5000/api/expenses/${editingExpense._id}`
                : 'http://localhost:5000/api/expenses/add';
            const method = editingExpense ? 'put' : 'post';
        
            const response = await axios[method](url, { ...formExpense }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
    
            if (editingExpense) {
                setExpenses(expenses.map(exp => exp._id === response.data.expense._id ? response.data.expense : exp));
            } else {
                setExpenses([...expenses, response.data.expense]);
            }
    
            resetForm();
            fetchExpenses();
        } catch (error) {
            console.error('Erro ao adicionar/editar despesa:', error);
            alert('Erro ao processar a requisição!');
        }
    };
    
    const handleRemoveExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setExpenses(expenses.filter(exp => exp._id !== id));
        } catch (error) {
            console.error('Erro ao excluir despesa:', error);
        }
    };

    const editExpense = (expense) => {
        setEditingExpense(expense);
        const formattedDate = expense.date ? new Date(expense.date) : null;
        const dateString = formattedDate && !isNaN(formattedDate) ? formattedDate.toISOString().split('T')[0] : '';
        setFormExpense({ date: dateString, category: expense.category, value: expense.value });
    };

    const resetForm = () => {
        setFormExpense({ date: '', category: '', value: '' });
        setEditingExpense(null);
    };

    return (
        <div className="DespesasModal">
            <div className="ModalContent">
                <div className="ModalHeader">
                    <span>Despesas</span>
                    <X size={24} onClick={onClose} />
                </div>
                <div className="ModalBody">
                    <h3>Todas as despesas</h3>
                    <table className="ExpensesTable">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>
                                        {expense.date && !isNaN(new Date(expense.date))
                                        ? new Date(new Date(expense.date).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).toISOString().split('T')[0]
                                        : 'Data inválida'}
                                    </td>
                                    <td>{expense.category}</td>
                                    <td>R$ {expense.value}</td>
                                    <td>
                                        <button className="edit" onClick={() => editExpense(expense)}>Editar</button>
                                        <button className="delete" onClick={() => handleRemoveExpense(expense._id)}>Excluir</button>
                                    </td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="AddExpenseForm">
                        <h4>{editingExpense ? 'Editar Despesa' : 'Adicionar Despesa'}</h4>
                        <input 
                            type="date"
                            name="date"
                            value={formExpense.date}
                            onChange={handleInputChange}
                            max="9999-12-31" 
                        />
                        <input type="text" name="category" value={formExpense.category} onChange={handleInputChange} />
                        <input type="number" name="value" value={formExpense.value} onChange={handleInputChange} />
                        <button onClick={handleAddOrEditExpense}>
                            {editingExpense ? 'Atualizar' : 'Adicionar'}
                        </button>
                        <button onClick={resetForm}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
