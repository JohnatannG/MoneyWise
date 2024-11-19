import React, { useEffect, useState } from 'react';
import '../styles/Balancetotal.css'

export default function Balancetotal() {
    const [income, setIncome] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setIncome(data.income);
                } else {
                    setError(data.message || 'Erro ao carregar saldo.');
                }
            } catch (err) {
                setError('Erro ao conectar ao servidor.');
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="dashboard-balance">
            <h2>Saldo do Mês</h2>
            {income !== null ? (
                <p>R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
