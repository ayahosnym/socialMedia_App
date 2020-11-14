import Axios from "axios";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import StateGlobal from "../../StateGlobal";
import LoadingIcon from "../LoadingIcon";
import Page from "../Page";
import Post from "../Post";

import "./Home.css";

export default function Home() {
  const stateGlobal = useContext(StateGlobal);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    async function getHomeFeed() {
      try {
        const response = await Axios.post(`/getHomeFeed`, {
          token: stateGlobal.userInfo.token,
        });
        console.log(response.data);
        setState((copyState) => {
          copyState.feed = response.data;
          copyState.isLoading = false;
        });
      } catch (error) {
        console.log("there is a proplem");
      }
    }
    getHomeFeed();
  }, []);

  if (state.isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  return (
    <Page title="Your Feed">
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{stateGlobal.userInfo.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
      {state.feed.length > 1 && (
        <>
          <h2 className="text-center">The latest from those you follow them</h2>
          <div className="list-group">
            {state.feed.map((post, index) => {
              return <Post post={post} key={index} />;
            })}
          </div>
        </>
      )}
    </Page>
  );
}
