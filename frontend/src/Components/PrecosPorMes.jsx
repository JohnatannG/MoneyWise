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
    const interval = setInterval(fetchExpenses, 3000);
  }, []);

  const chartData = {
    labels: expensesData.map(expense => expense.category || 'Sem Categoria'), 
    datasets: [
      {
        label: 'Despesas',
        data: expensesData.map(expense => parseFloat(expense.value)), 
        backgroundColor: '#6A00DB',
        borderColor: '#4A00B3',
        borderWidth: 1,
      },
    ],
  };

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
    <div className='graficodespesas' style={{
      width: '100%',
      height: 'fit-content',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      gridColumn: 'span 2',
      boxShadow: '0px 0px 15px rgba(170, 170, 170, 0.185)',
    }}>

      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PrecosPorMes;
