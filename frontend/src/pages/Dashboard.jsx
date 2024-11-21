import React, { useState, useEffect } from "react";
import BalanceTotal from "../Components/BalanceTotal";
import DespesasTotal from "../Components/DespesasTotal";
import MobileSidebar from "../Components/MobileSidebar.JSX";
import PrecosPorMes from "../Components/PrecosPorMes";
import ReceitasPorMes from "../Components/ReceitasPorMes";
import SaldoComDespesas from "../Components/SaldoComDespesas";
import Sidebar from "../Components/Sidebar";
import TotalReceitas from "../Components/TotalReceitas";
import UltimasDespesas from "../Components/UltimasDespesas";
import UltimasMetas from "../Components/UltimasMetas";
import UltimasReceitas from "../Components/UltimasReceitas";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const checkScreenWidth = () => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkScreenWidth(); 
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="Dashboard">
      {isMobile ? <MobileSidebar /> : <Sidebar />}

      <div className="grid-container">
        <BalanceTotal />
        <SaldoComDespesas />
        <DespesasTotal />
        <TotalReceitas />
        <UltimasDespesas />
        <UltimasReceitas />
        <PrecosPorMes />
        <ReceitasPorMes />
        <UltimasMetas goals={goals} />
      </div>
    </div>
  );
}
