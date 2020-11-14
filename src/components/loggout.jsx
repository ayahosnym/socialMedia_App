import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import DispatchGlobal from "../DispatchGlobal";
import StateGlobal from "../StateGlobal";

export default function Loggout() {
  const dispatchGlobal = useContext(DispatchGlobal);
  const stateGlobal = useContext(StateGlobal);

  const history = useHistory();

  function handleLoggout() {
    dispatchGlobal({ type: "logout" });
    history.push("/");
  }
  function handleOpenSearch() {
    dispatchGlobal({ type: "openSearch" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      {/*  search icon */}
      <Link
        onClick={handleOpenSearch}
        to="#"
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </Link>
      {/* chat icon */}
      <span
        onClick={() => dispatchGlobal({ type: "chatToggle" })}
        className="mr-2 header-chat-icon text-white"
        style={{ cursor: "pointer" }}
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>

      <Link to={`/profile/${stateGlobal.userInfo.username}`} className="mr-2">
        <img
          className="small-header-avatar"
          src={stateGlobal.userInfo.avatar}
        />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLoggout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}
