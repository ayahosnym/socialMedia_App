import Axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams, Switch, Route } from "react-router-dom";
import { useImmer } from "use-immer";
import Page from "../Page";
import StateGlobal from "../../StateGlobal";
import ProfilePosts from "../ProfilePosts/ProfilePosts";
import ProfileFollow from "../ProfileFollow/ProfileFollow";

import "./Profile.css";

export default function Profile() {
  const { username } = useParams();
  const stateGlobal = useContext(StateGlobal);
  const [state, setState] = useImmer({
    followingActionLoading: false,
    unfollowingActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      isFollowing: false,
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
    },
  });

  useEffect(() => {
    async function getData() {
      try {
        const response = await Axios.post(`/profile/${username}`, {
          token: stateGlobal.userInfo.token,
        });
        setState((copyState) => {
          copyState.profileData = response.data;
        });
      } catch (error) {
        console.log("there is a proplem");
      }
    }
    getData();
  }, [username]);
  // handel start following

  function handleStartFllowing() {
    setState((copyState) => {
      copyState.startFollowingRequestCount++;
    });
  }
  //
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((copyState) => {
        copyState.followingActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function startFollowing() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            { token: stateGlobal.userInfo.token },
            { CancelToken: ourRequest.token }
          );
          setState((copyState) => {
            copyState.isFollowing = true;
            copyState.profileData.counts.followerCount++;
            copyState.followingActionLoading = false;
          });
        } catch (error) {
          console.log("there is a problem");
        }
      }

      startFollowing();
      return () => ourRequest.cancel();
    }
  }, [state.startFollowingRequestCount]);

  // handel stop following
  function handleStopFllowing() {
    setState((copyState) => {
      copyState.stopFollowingRequestCount++;
    });
  }
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((copyState) => {
        copyState.followingActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function stopFollowing() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            { token: stateGlobal.userInfo.token },
            { cancelToken: ourRequest.token }
          );
          setState((copyState) => {
            // copyState.startFollowingRequestCount--;
            copyState.profileData.counts.followerCount--;
            copyState.profileData.isFollowing = false;
            copyState.followingActionLoading = false;
          });
        } catch (error) {
          console.log("there is a problem in stop sollowing");
        }
      }
      stopFollowing();
      return () => ourRequest.cancel();
    }
  }, [state.stopFollowingRequestCount]);
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername} {/* //start following */}
        {stateGlobal.checkUserLogged &&
          stateGlobal.userInfo.username != state.profileData.profileUsername &&
          !state.profileData.isFollowing &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={handleStartFllowing}
              disabled={state.followingActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {/* //stop following */}
        {stateGlobal.checkUserLogged &&
          stateGlobal.userInfo.username != state.profileData.profileUsername &&
          state.profileData.isFollowing &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={handleStopFllowing}
              disabled={state.unfollowingActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Unfollow <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>
      {/* // */}
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts:
          {state.profileData.counts.postCount}
        </NavLink>

        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers:
          {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following:
          {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      {/* //////////////////////////// */}
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollow action="followers" followCount={state.profileData.counts.followerCount} />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollow action="following" followCount={state.profileData.counts.followingCount}/>
        </Route>
      </Switch>
    </Page>
  );
}
