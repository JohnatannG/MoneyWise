import React, { useEffect, useState } from 'react';
import '../styles/ReceitasPorMes.css' 
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ReceitasPorMes = () => {
  const [revenuesData, setRevenuesData] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/revenues', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const revenues = response.data;
        setRevenuesData(revenues);
        formatDataForChart(revenues);
      } catch (error) {
        console.error('Erro ao carregar as receitas:', error);
      }
    };

    fetchRevenues();
    const interval = setInterval(fetchRevenues, 3000);
  }, []);

  const formatDataForChart = (revenues) => {
    // Agrupar os dados pela categoria fornecida pelo usuário
    const formattedData = revenues.reduce((acc, revenue) => {
      const category = revenue.category; // Usando a categoria fornecida pelo usuário

      const existingCategory = acc.find(item => item.name === category);
      if (existingCategory) {
        existingCategory.value += parseFloat(revenue.value);
      } else {
        acc.push({
          name: category, // Nome da categoria
          value: parseFloat(revenue.value), // Valor da receita
        });
      }

      return acc;
    }, []);

    setDataChart(formattedData);
  };

  const chartData = {
    labels: dataChart.map(item => item.name), // Labels serão as categorias
    datasets: [
      {
        label: 'Receitas',
        data: dataChart.map(item => item.value), // Valores das receitas
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
            return `R$ ${context.raw.toFixed(2)}`; // Formatar o valor do tooltip
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
    <div className='graficoreceitas' style={{
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

export default ReceitasPorMes;
