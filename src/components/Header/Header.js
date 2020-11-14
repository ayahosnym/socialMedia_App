import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import StateGlobal from "../../StateGlobal";
import Loggout from "../loggout";
import LoginForm from "../loginForm";
import "./Header.css";

export default function Header() {
  const stateGlobal = useContext(StateGlobal)
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {stateGlobal.checkUserLogged ? <Loggout/> : <LoginForm />}
      </div>
    </header>
  );
}
