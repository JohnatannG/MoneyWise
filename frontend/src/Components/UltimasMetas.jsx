import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UltimasMetas.css';

export default function UltimasMetas() {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        // Função para buscar metas do servidor
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

        // Busca as metas imediatamente ao montar o componente
        fetchGoals();

        // Atualiza as metas a cada 3 segundos
        const interval = setInterval(fetchGoals, 3000);

        // Limpa o intervalo quando o componente for desmontado
        return () => clearInterval(interval);
    }, []);

    // Ordena as metas pela ordem de adição e pega as 3 últimas
    const lastGoals = [...goals].slice(-3).reverse();

    return (
        <div className="ultimas-metas">
            <h3>Últimas Metas</h3>
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
