import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import StateGlobal from "../../StateGlobal";
import LoadingIcon from "../LoadingIcon";
import NotFound from "../NotFound";
import Page from "../Page";
import "./EditPost.css";

export default function EditPost() {
  const { id, username } = useParams();
  const stateGlobal = useContext(StateGlobal);
  const redirect = useHistory();

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
  function reducers(stateCopy, action) {
    switch (action.type) {
      case "fetchPostCompleted":
        stateCopy.title.value = action.value.title;
        stateCopy.body.value = action.value.body;
        stateCopy.isFetching = false;
        break;
      case "titleChanged":
        stateCopy.title.value = action.value;
        stateCopy.title.hasErrors = false;
        break;
      case "bodyChanged":
        stateCopy.body.value = action.value;
        stateCopy.body.hasErrors = false;
        break;
      case "submit":
        if (!stateCopy.title.hasErrors && !stateCopy.body.hasErrors) {
          stateCopy.sendCount++;
        }
        break;
      case "savingEditStarted":
        stateCopy.isSaving = true;
        break;
      case "savingEditFinished":
        stateCopy.isSaving = false;
        break;
      case "titleRules":
        if (!action.value.trim()) {
          stateCopy.title.hasErrors = true;
          stateCopy.title.message = "you must provide title";
        }
        break;
      case "bodyRules":
        if (!action.value.trim()) {
          stateCopy.body.hasErrors = true;
          stateCopy.body.message = "you must provide body";
        }
        break;
      case "notFound":
        stateCopy.notFound = true;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(reducers, originalState);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submit" });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function getPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchPostCompleted", value: response.data });
          if (stateGlobal.userInfo.username != response.data.author.username) {
            redirect.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
        console.log(response.data);
      } catch (error) {
        console.log("There was a problem or the request was cancelled.");
      }
    }
    getPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "savingEditStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function sendEditingPost() {
        try {
          const response = await Axios.post(
            `/post/${id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: stateGlobal.userInfo.token,
            },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "savingEditFinished" });
        } catch (error) {
          console.log("error");
        }
      }
      sendEditingPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );
  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back To Prev Post
      </Link>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            autoComplete="off"
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "titleChanged", value: e.target.value })
            }
            value={state.title.value}
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger">{state.title.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={(e) =>
              dispatch({ type: "bodyChanged", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            value={state.body.value}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger">{state.body.message}</div>
          )}
        </div>
        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </Page>
  );
}
