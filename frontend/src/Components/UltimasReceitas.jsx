import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UltimasReceitas.css";

export default function UltimasReceitas() {
  const [lastRevenues, setLastRevenues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLastRevenues();
    }, 1000); // 1000ms = 1 segundo

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  const fetchLastRevenues = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/revenues", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const sortedRevenues = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setLastRevenues(sortedRevenues.slice(0, 3)); // Exibir apenas as 3 últimas receitas
    } catch (error) {
      console.error("Erro ao carregar as últimas receitas:", error);
      setError("Erro ao carregar as receitas.");
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="ultimas-receitas">
      <h3>Últimas Receitas</h3>
      <table>
        <thead className="tesxte-da">
          <tr className="table-teste">
            <th>Data</th>
            <th>Categoria</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {lastRevenues.map((revenue) => (
            <tr key={revenue._id}>
              <td>
                {revenue.date && !isNaN(new Date(revenue.date))
                  ? new Date(revenue.date).toLocaleDateString("pt-BR")
                  : "Data inválida"}
              </td>
              <td>{revenue.category}</td>
              <td>R$ {revenue.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
