import { useState } from "react";
import "../styles/MobileSidebar.css";
import { AlignLeft } from "lucide-react";
import Logo from "./Logo";
import DespesasModal from "./DespesasModal";
import ReceitasModal from "./ReceitasModal";
import MetasModal from "./MetasModal";
import { useNavigate } from "react-router-dom"; 

export default function MobileSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDespesasModalOpen, setIsDespesasModalOpen] = useState(false); 
  const [isReceitasModalOpen, setIsReceitasModalOpen] = useState(false); 
  const [isMetasModalOpen, setIsMetasModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate(); 

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (item) => {
    setIsMenuOpen(false); 
    if (item === "Despesas") {
      setIsDespesasModalOpen(true);
    } else if (item === "Receitas") {
      setIsReceitasModalOpen(true);
    } else if (item === "Metas") {
      setIsMetasModalOpen(true);
    } else if (item === "Logout") {
      setIsLogoutModalOpen(true); 
    }
  };

  const handleConfirmLogout = () => {
    
    console.log("Logout confirmado!");

    
    navigate("/");

    setIsLogoutModalOpen(false); 
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="MobileMenu">
      <div className="MenuHeader">
        <Logo />
        <button className="HamburgerIcon" onClick={handleToggleMenu}>
          <AlignLeft size={28} />
        </button>
      </div>

      <div className={`MenuContent ${isMenuOpen ? "open" : ""}`}>
        <ul className="MenuList">
          <li onClick={() => handleItemClick("Dashboard")}>Dashboard</li>
          <li onClick={() => handleItemClick("Despesas")}>Despesas</li>
          <li onClick={() => handleItemClick("Receitas")}>Receitas</li>
          <li onClick={() => handleItemClick("Metas")}>Metas</li>
        </ul>
        <div className="MenuFooter" onClick={() => handleItemClick("Logout")}>
          Sair da conta
        </div>
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
            <button onClick={handleConfirmLogout}>
              <p className="Sair">Sim</p>
            </button>
            <button onClick={handleCancelLogout}>
              <p className="NaoSair">Cancelar</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
