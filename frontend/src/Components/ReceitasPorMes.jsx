import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

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
  }, []);

  const formatDataForChart = (revenues) => {
    const formattedData = revenues.reduce((acc, revenue) => {
      const monthYear = new Date(revenue.date).toLocaleString('default', { month: 'short', year: 'numeric' });

      const existingMonth = acc.find(item => item.name === monthYear);
      if (existingMonth) {
        existingMonth.value += parseFloat(revenue.value);
      } else {
        acc.push({ name: monthYear, value: parseFloat(revenue.value) });
      }

      return acc;
    }, []);

    setDataChart(formattedData);
  };

  return (
    <div style={{
      width: '100%',
      height: '300',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      gridColumn: 'span 2',
      boxShadow: '0px 0px 15px rgba(198, 198, 198, 0.164)'
    }}>
      <h3>Variação de Preço por Mês das receitas</h3>
      <ResponsiveContainer width="90%" height="90%">
        <BarChart data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#6A00DB" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReceitasPorMes;
