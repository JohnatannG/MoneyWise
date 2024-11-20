import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Certifique-se de instalar o Axios
import '../styles/UltimasMetas.css';

export default function UltimasMetas() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                // Obtendo o token do localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token de autenticação não encontrado.');
                    return;
                }

                // Realizando a requisição para buscar as metas
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

        // Chama a função inicialmente
        fetchGoals();

        // Configura o intervalo para atualizar a cada 1 segundo (1000ms)
        const intervalId = setInterval(() => {
            fetchGoals();
        }, 1000);

        // Limpa o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, []);

    const lastGoals = [...goals].slice(-3).reverse(); // Pega as últimas 3 metas

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
