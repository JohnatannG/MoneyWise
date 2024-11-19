import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UltimasDespesas.css';

export default function UltimasDespesas() {
    const [lastExpenses, setLastExpenses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLastExpenses();
    }, []);

    const fetchLastExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setLastExpenses(sortedExpenses.slice(0, 3));
        } catch (error) {
            console.error('Erro ao carregar as últimas despesas:', error);
            setError('Erro ao carregar as despesas.');
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="ultimas-despesas">
            <h3>Últimas Despesas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {lastExpenses.map((expense) => (
                        <tr key={expense._id}>
                            <td>
                                {expense.date && !isNaN(new Date(expense.date))
                                    ? new Date(expense.date).toLocaleDateString('pt-BR')
                                    : 'Data inválida'}
                            </td>
                            <td>{expense.category}</td>
                            <td>R$ {expense.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
