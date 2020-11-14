import React, { useState, useEffect, useContext } from "react";
import Page from "../Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import DispatchGlobal from "../../DispatchGlobal";
import "./HomeGuest.css";

export default function HomeGuest() {
  const dispatchGlobal = useContext(DispatchGlobal);
  const initialState = {
    username: {
      value: "",
      hasErorr: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErorr: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErorr: false,
      message: "",
    },
    submitCount: 0,
  };
  function reducers(stateCopy, action) {
    switch (action.type) {
      case "usernameImmediately":
        stateCopy.username.hasErorr = false;
        stateCopy.username.value = action.value;
        if (stateCopy.username.value.length > 30) {
          stateCopy.username.hasErorr = true;
          stateCopy.username.message = "Username cannot exceed 30 characters.";
        }
        if (
          stateCopy.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(stateCopy.username.value)
        ) {
          stateCopy.username.hasErorr = true;
          stateCopy.username.message =
            "Username can only contain letters and numbers.";
        }
        return;
      case "usernameAfterDelay":
        if (stateCopy.username.value.length < 3) {
          stateCopy.username.hasErorr = true;
          stateCopy.username.message =
            "Username must be more than 3 characters.";
        }
        if (!stateCopy.username.hasErorr && !action.noRequest) {
          stateCopy.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.value) {
          stateCopy.username.isUnique = false;
          stateCopy.username.hasErorr = true;
          stateCopy.username.message = "That username is already taken";
        } else {
          stateCopy.username.isUnique = true;
          stateCopy.username.hasErorr = false;
        }
        return;
      case "emailImmediately":
        stateCopy.email.hasErorr = false;
        stateCopy.email.value = action.value;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(stateCopy.email.value)) {
          stateCopy.email.hasErorr = true;
          stateCopy.email.message = "You must provide valide email address";
        }
        if (!stateCopy.email.hasErorr && !action.noRequest) {
          stateCopy.email.checkCount++;
        }
        return;
      case "emailUniqueResults":
        if (action.value) {
          stateCopy.email.hasErorr = true;
          stateCopy.email.isUnique = false;
          stateCopy.email.message = "That email already exist";
        } else {
          stateCopy.email.hasErorr = false;
          stateCopy.email.isUnique = true;
        }
        return;
      case "passwordImmediately":
        stateCopy.password.hasErorr = false;
        stateCopy.password.value = action.value;
        if (stateCopy.password.value.length > 50) {
          stateCopy.password.hasErorr = true;
          stateCopy.password.message = "Password can not exceed 50 chars";
        }
        return;
      case "passwordAfterDelay":
        if (stateCopy.password.value.length < 12) {
          stateCopy.password.hasErorr = true;
          stateCopy.password.message = "Password must be at least 12 chars";
        }
        return;
      case "submitForm":
        if (
          !stateCopy.username.hasErorr &&
          stateCopy.username.isUnique &&
          !stateCopy.email.hasErorr &&
          stateCopy.email.isUnique &&
          !stateCopy.password.hasErorr
        ) {
          stateCopy.submitCount++;
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(reducers, initialState);
  //username
  // useeffect to check if user name less than 3 chars
  useEffect(() => {
    if (state.username.value) {
      let delay = setTimeout(() => {
        dispatch({ type: "usernameAfterDelay" });
      }, 550);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);
  // send name to database to check if username unique or we aleady taken
  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function checkUniqueUsername() {
        try {
          const response = await Axios.post(
            "/doesUsernameExist",
            { username: state.username.value },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (error) {
          console.log("there is a problem or name is not Unique");
        }
      }

      checkUniqueUsername();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);
  // check email after delay to see if it is unique or not
  useEffect(() => {
    if (state.email.value) {
      let delay = setTimeout(() => {
        dispatch({ type: "emailAfterDelay" });
      }, 550);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);
  //
  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function checkUniqueUsername() {
        try {
          const response = await Axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (error) {
          console.log("there is a problem or name is not Unique");
        }
      }

      checkUniqueUsername();
      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);
  //password
  useEffect(() => {
    if (state.password.value) {
      let delay = setTimeout(() => {
        dispatch({ type: "passwordAfterDelay" });
      }, 550);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  //////////
  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: ourRequest.token }
          );
          dispatchGlobal({ type: "login", data: response.data });
          dispatchGlobal({
            type: "flashMessage",
            value: "Congrats! Welcome to your new account",
          });
        } catch (error) {
          console.log("there is a problem");
        }
      }
      fetchResult();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);
  ////

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({
      type: "usernameAfterDelay",
      value: state.username.value,
      noRequest: true,
    });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({
      type: "emailAfterDelay",
      value: state.email.value,
      noRequest: true,
    });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  }

  // submit form

  return (
    <Page className="container py-md-5" title="HomeGuest">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={(e) =>
                  dispatch({
                    type: "usernameImmediately",
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErorr}
                timeout={330}
                unmountOnExit
                classNames="liveValidateMessage"
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={(e) =>
                  dispatch({ type: "emailImmediately", value: e.target.value })
                }
              />
              <CSSTransition
                in={state.email.hasErorr}
                timeout={330}
                unmountOnExit
                classNames="liveValidateMessage"
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={(e) =>
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasErorr}
                timeout={330}
                unmountOnExit
                classNames="liveValidateMessage"
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}
