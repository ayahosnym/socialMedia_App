import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import LoadingIcon from "../LoadingIcon";
import Page from "../Page";
import "./ProfileFollow.css";

export default function ProfileFollow(props) {
  const [state, setState] = useImmer({
    followers: [],
    isLoading: true,
  });
  const { username } = useParams();
  useEffect(() => {
    async function getFollowing() {
      try {
        const response = await Axios.get(
          `/profile/${username}/${props.action}`
        );
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
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  return (
    <>
      <div className="list-group">
        {props.followCount > 0 ? (
          state.followers.map((follower, index) => {
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
          })
        ) : (
          <p>
            You don't{" "}
            {props.action == "followers"
              ? "have any followers yet"
              : "follow anyone start to follow"}
          </p>
        )}
      </div>
    </>
  );
}
