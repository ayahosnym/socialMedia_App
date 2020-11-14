import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import DispatchGlobal from "../../DispatchGlobal";
import LoadingIcon from "../LoadingIcon";
import Post from "../Post";

export default function Search() {
  const dispatchGlobal = useContext(DispatchGlobal);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "nothing",
    requestCount: 0,
  });
  function handelSearchInput(e) {
    const searchValue = e.target.value;
    setState((copyState) => {
      copyState.searchTerm = searchValue;
    });
  }

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((copyState) => {
        copyState.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((copyState) => {
          copyState.requestCount++;
        });
      }, 1000);
      return () => {
        clearTimeout(delay);
      };
    } else {
      setState((copyState) => {
        copyState.show = "nothing";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function getSearchingResult() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: ourRequest.token }
          );
          setState((copyState) => {
            copyState.results = response.data;
            copyState.show = "results";
          });
          // console.log("search", response.data);
        } catch (error) {
          console.log("there is a problem in search");
        }
      }
      getSearchingResult();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handelSearchInput}
          />
          <span
            onClick={() => dispatchGlobal({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div>{state.show == "loading" ? <LoadingIcon /> : ""}</div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              {Boolean(state.results.length) && (
                <>
                  <div className="list-group-item active">
                    <strong>Search Results</strong> {state.results.length}{" "}
                    {state.results.length > 1 ? "items" : "item"} found
                  </div>
                  {state.results.map((post) => {
                    return (
                      <Post
                        post={post}
                        onClick={() => dispatchGlobal({type:"closeSearch" })}
                      />
                    );
                  })}
                </>
              )}
              {!Boolean(state.results.length) && (
                <p className="alert alert-danger shadow-sm">
                  Sorry there is no result for that search
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
