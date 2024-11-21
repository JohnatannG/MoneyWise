import React, { useEffect, useState } from 'react';
import '../styles/Balancetotal.css';
import '../styles/SaldoComDespesas.css'
export default function SaldoComDespesas() {
    const [income, setIncome] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [revenues, setRevenues] = useState([]);
    const [error, setError] = useState('');
    const [finalBalance, setFinalBalance] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const userResponse = await fetch('http://localhost:5000/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const userData = await userResponse.json();
                
                if (userResponse.ok) {
                    setIncome(userData.income);
                } else {
                    setError(userData.message || 'Erro ao carregar saldo.');
                }

                const expensesResponse = await fetch('http://localhost:5000/api/expenses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const expensesData = await expensesResponse.json();

                if (expensesResponse.ok) {
                    setExpenses(expensesData);
                } else {
                    setError(expensesData.message || 'Erro ao carregar despesas.');
                }

                const revenuesResponse = await fetch('http://localhost:5000/api/revenues', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const revenuesData = await revenuesResponse.json();

                if (revenuesResponse.ok) {
                    setRevenues(revenuesData);
                } else {
                    setError(revenuesData.message || 'Erro ao carregar receitas.');
                }
            } catch (err) {
                setError('Erro ao conectar ao servidor.');
            }
        };

        fetchUserData(); 

        const intervalId = setInterval(() => {
            fetchUserData();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (income !== null) {
            let balance = income;

            if (revenues.length > 0) {
                const totalRevenues = revenues.reduce((acc, revenue) => acc + revenue.value, 0);
                balance -= totalRevenues;
            }

            if (expenses.length > 0) {
                const totalExpenses = expenses.reduce((acc, expense) => acc + expense.value, 0);
                balance -= totalExpenses;
            }

            setFinalBalance(balance);
        }
    }, [income, revenues, expenses]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="dashboard-balancea">
            <h2>Saldo atual</h2>
            {finalBalance !== null ? (
                <p>R$ {finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
