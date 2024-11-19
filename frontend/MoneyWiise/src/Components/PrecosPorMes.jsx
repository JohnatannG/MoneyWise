import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PrecosPorMes = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const expenses = response.data;
        setExpensesData(expenses);
        formatDataForChart(expenses);
      } catch (error) {
        console.error('Erro ao carregar as despesas:', error);
      }
    };

    fetchExpenses();
  }, []);

  const formatDataForChart = (expenses) => {
    const formattedData = expenses.reduce((acc, expense) => {
      const monthYear = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });

      const existingMonth = acc.find(item => item.name === monthYear);
      if (existingMonth) {
        existingMonth.value += parseFloat(expense.value);
      } else {
        acc.push({ name: monthYear, value: parseFloat(expense.value) });
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
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      gridColumn: 'span 2',
      boxShadow: '0px 0px 15px rgba(198, 198, 198, 0.164)',
    }}>
      <h3>Variação de Preço por Mês das despesas</h3>
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

export default PrecosPorMes;
