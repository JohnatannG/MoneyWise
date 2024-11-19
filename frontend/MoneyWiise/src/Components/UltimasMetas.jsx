import React, { useEffect, useState } from 'react';
import '../styles/UltimasMetas.css';

export default function UltimasMetas() {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
        setGoals(savedGoals);
    }, []); 

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
