import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/PrecosPorMes.css';

// Registrar componentes do Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PrecosPorMes = () => {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExpensesData(response.data);
      } catch (error) {
        console.error('Erro ao carregar as despesas:', error);
      }
    };

    fetchExpenses();
  }, []);

  // Dados para o gráfico
  const chartData = {
    labels: expensesData.map(expense => expense.category || 'Sem Categoria'), // Exibe a categoria ou "Sem Categoria"
    datasets: [
      {
        label: 'Despesas',
        data: expensesData.map(expense => parseFloat(expense.value)), // Valores das despesas
        backgroundColor: '#6A00DB',
        borderColor: '#4A00B3',
        borderWidth: 1,
      },
    ],
  };

  // Configurações do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `R$ ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Valor (R$)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{
      width: '100%',
      height: 'fit-content',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      gridColumn: 'span 2',
      boxShadow: '0px 0px 15px rgba(198, 198, 198, 0.164)',
    }}>

      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PrecosPorMes;
