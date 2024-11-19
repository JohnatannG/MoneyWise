import BalanceTotal from "../Components/BalanceTotal";
import DespesasTotal from "../Components/DespesasTotal";
import Metas from "../Components/MetasModal";
import PrecosPorMes from "../Components/PrecosPorMes";
import ReceitasPorMes from "../Components/ReceitasPorMes";
import SaldoComDespesas from "../Components/SaldoComDespesas";
import Sidebar from "../Components/Sidebar";
import TotalReceitas from "../Components/TotalReceitas";
import UltimasDespesas from "../Components/UltimasDespesas";
import UltimasMetas from "../Components/UltimasMetas";
import UltimasReceitas from "../Components/UltimasReceitas";
import "../styles/Dashboard.css";
import React, { useState } from 'react';

export default function Dashboard() {
    const [goals, setGoals] = useState([]);

  return (
    <div className="Dashboard">
      <Sidebar />
      <div className="grid-container">
        <BalanceTotal />
        <SaldoComDespesas />
        <DespesasTotal />
        <TotalReceitas />
        <UltimasReceitas />
        <UltimasDespesas />
        <PrecosPorMes />
        <ReceitasPorMes />
        <UltimasMetas goals={goals}/>
      </div>
    </div>
  );
}
