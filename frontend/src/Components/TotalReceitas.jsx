import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TotalReceitas.css';

export default function TotalReceitas() {
    const [revenues, setRevenues] = useState([]);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRevenues = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/revenues', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRevenues(response.data);
            } catch (error) {
                console.error('Erro ao carregar as receitas:', error);
                setError('Erro ao carregar as receitas.');
            }
        };

        const intervalId = setInterval(() => {
            fetchRevenues();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const total = revenues.reduce((acc, revenue) => acc + parseFloat(revenue.value || 0), 0);
        setTotalReceitas(total);
    }, [revenues]);
    
    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="total-receitas">
            <h2>Total de Receitas</h2>
            <p>R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
    );
}
