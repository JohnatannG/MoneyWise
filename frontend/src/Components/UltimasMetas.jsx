import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import '../styles/UltimasMetas.css';

export default function UltimasMetas() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token de autenticação não encontrado.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/goals', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setGoals(response.data);
            } catch (err) {
                console.error('Erro ao buscar as metas:', err);
                setError('Erro ao carregar as metas.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();

        const intervalId = setInterval(() => {
            fetchGoals();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const lastGoals = [...goals].slice(-3).reverse();

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="ultimas-metas">
            <h3>Últimas Metas</h3>
            {error && <p className="error">{error}</p>}
            {lastGoals.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Meta (R$)</th>
                            <th>Investido (R$)</th>
                            <th>Progresso (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastGoals.map((goal, index) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma meta adicionada.</p>
            )}
        </div>
    );
}
