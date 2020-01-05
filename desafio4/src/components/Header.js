import React from "react";
import "./Header.css";
import FacebookLogo from "../assets/facebook.png";

function Header() {
  return (
    <header id="header-principal">
      <img src={FacebookLogo} alt="facebook" />
      <span>
        Meu perfil &nbsp;<i className="fas fa-user-circle"></i>
      </span>
    </header>
  );
}

export default Header;
