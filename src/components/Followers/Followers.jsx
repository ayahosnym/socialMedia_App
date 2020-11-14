import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import LoadingIcon from "../LoadingIcon";
import Page from "../Page";
import "./Followers.css";

export default function Followers() {
  // const [isLoading, setIsloading] = useState(true);
  // const [followers, setFollowers] = useState([]);

  const [state, setState] = useImmer({
    followers: [],
    isLoading: true,
  });
  const { username } = useParams();
  useEffect(() => {
    async function getFollowers() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`);
        setState((copyState) => {
          copyState.followers = response.data;
          copyState.isLoading = false;
        });
        console.log(response.data);
      } catch (error) {
        console.log("there is a problem to display followers");
      }
    }
    getFollowers();
  }, [username]);

  if (state.isLoading)
    return (
      <Page>
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
