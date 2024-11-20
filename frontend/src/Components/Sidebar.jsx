import { useState } from "react";
import "../styles/Sidebar.css";
import Logo from "./Logo";
import DespesasModal from "./DespesasModal";
import ReceitasModal from "./ReceitasModal";
import MetasModal from "./MetasModal";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard"); 
  const [isDespesasModalOpen, setIsDespesasModalOpen] = useState(false); 
  const [isReceitasModalOpen, setIsReceitasModalOpen] = useState(false); 
  const [isMetasModalOpen, setIsMetasModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === "Despesas") {
      setIsDespesasModalOpen(true);
    } else if (item === "Receitas") {
      setIsReceitasModalOpen(true);
    } else if (item === "Metas") {
      setIsMetasModalOpen(true);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };


  const handleConfirmLogout = () => {
    navigate("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="Sidebar">
      <Logo />

      <div className="Tittle-and-List">
        <h3 className="Tittle-sidebar">Principal</h3>

        <ul className="List-modal">
          {["Dashboard", "Despesas", "Receitas", "Metas"].map((item) => (
            <li
              key={item}
              className={activeItem === item ? "List-modal-active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="Exit" onClick={handleLogoutClick}>
        <h2 className="Tittle-exit">Sair</h2>
      </div>

      {isDespesasModalOpen && (
        <DespesasModal onClose={() => setIsDespesasModalOpen(false)} />
      )}

      {isReceitasModalOpen && (
        <ReceitasModal onClose={() => setIsReceitasModalOpen(false)} />
      )}

      {isMetasModalOpen && (
        <MetasModal onClose={() => setIsMetasModalOpen(false)} />
      )}

      {isLogoutModalOpen && (
        <div className="LogoutModal">
          <div className="ModalContent-logout">
            <h3 className="TitleLogOut">Tem certeza que deseja sair?</h3>
            <button onClick={handleConfirmLogout}><p className="Sair">Sim</p></button>
            <button onClick={handleCancelLogout}><p className="NaoSair">Cancelar</p></button>
          </div>
        </div>
      )}
    </div>
  );
}
