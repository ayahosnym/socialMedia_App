import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import LoadingIcon from "../LoadingIcon";
import Page from "../Page";
import "./Following.css";

export default function Following() {
  const [state, setState] = useImmer({
    followers: [],
    isLoading: true,
  });
  const { username } = useParams();
  useEffect(() => {
    async function getFollowing() {
      try {
        const response = await Axios.get(`/profile/${username}/following`);
        setState((copyState) => {
          copyState.followers = response.data;
          copyState.isLoading = false;
        });
        console.log(response.data);
      } catch (error) {
        console.log("there is a problem to display followers");
      }
    }
    getFollowing();
  }, [username]);

  if (state.isLoading)
    return (
      <Page title='...'>
        <LoadingIcon />
      </Page>
    );

  return (
    <>
      <div className="list-group">
        {state.followers.map((follower, index) => {
          return (
            <Link
              key={index}
              to={`/profile/${follower.username}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={follower.avatar} />{" "}
              {follower.username}
            </Link>
          );
        })}
      </div>
    </>
  );
}
