import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useImmer } from "use-immer";
import DispatchGlobal from "../DispatchGlobal";
import StateGlobal from "../StateGlobal";

export default function Chat() {
  const dispatchGlobal = useContext(DispatchGlobal);
  const stateGlobal = useContext(StateGlobal);
  const inputRef = useRef();
  const [state, setState] = useImmer({
    chatInputValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (stateGlobal.isChatOpen) {
      inputRef.current.focus();
    }
  }, [stateGlobal.isChatOpen]);

  function handleChatInput(e) {
    const value = e.target.value;
    setState((copyState) => {
      copyState.chatInputValue = value;
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    setState((copyState) => {
      copyState.chatInputValue = "";
      copyState.chatMessages.push({
        message: state.chatInputValue,
        username: stateGlobal.userInfo.username,
        avatar: stateGlobal.userInfo.avatar,
      });
    });
  }
  return (
    <div
      id="chat-wrapper"
      className="chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
    >
      <div className="chat-title-bar bg-primary">
        Chat
        {/* close chat */}
        <span
          onClick={() => dispatchGlobal({ type: "closeChat" })}
          className="chat-title-bar-close"
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log">
        {/* // chat self */}
        {state.chatMessages.map((message, index) => {
          if (message.username == stateGlobal.userInfo.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
        })}
        {/* chat other */}
        <div className="chat-other">
          <a href="#">
            <img
              className="avatar-tiny"
              src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
            />
          </a>
          <div className="chat-message">
            <div className="chat-message-inner">
              <a href="#">
                <strong>barksalot:</strong>
              </a>
              Hey, I am good, how about you?
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={inputRef}
          onChange={handleChatInput}
          value={state.chatInputValue}
        />
      </form>
    </div>
  );
}
