import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DespesasTotal.css';

export default function DespesasTotal() {
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expenses', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setExpenses(response.data);
                calculateTotalExpenses(response.data);
            } catch (error) {
                setError('Erro ao carregar as despesas.');
                console.error('Erro ao carregar as despesas:', error);
            }
        };

        const calculateTotalExpenses = (expenses) => {
            const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.value), 0);
            setTotalExpenses(total);
        };

        fetchExpenses();

        const intervalId = setInterval(() => {
            fetchExpenses();
        }, 1000);

        return () => clearInterval(intervalId);

    }, []);

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="dashboard-expenses">
            <h2>Total de Despesas</h2>
            <p>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
    );
}
