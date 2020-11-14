import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams, withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchGlobal from "../../DispatchGlobal";
import StateGlobal from "../../StateGlobal";
import LoadingIcon from "../LoadingIcon";
import NotFound from "../NotFound";
import Page from "../Page";
import "./ViewSinglePost.css";
import FlashMessage from "./../FlashMessages";
/////
function ViewSinglePost(props) {
  const { id } = useParams();

  const [isLoading, setIsloading] = useState(true);
  const [post, setPost] = useState([]);
  const stateGlobal = useContext(StateGlobal);
  const dispatchGlobal = useContext(DispatchGlobal);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function getPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsloading(false);
        console.log(response.data);
      } catch (error) {
        console.log("There was a problem or the request was cancelled...");
      }
    }
    getPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);
  ///
  if (!isLoading && !post) return <NotFound />;
  ////
  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );
  function isOwner() {
    if (stateGlobal.checkUserLogged) {
      return post.author.username === stateGlobal.userInfo.username;
    }
    return false;
  }
  ////////////////////////////////////

  async function handleDelete() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: stateGlobal.userInfo.token },
        });
        if (response.data === "Success") {
          // 1. display a flash message
          dispatchGlobal({
            type: "flashMessage",
            value: "Post was successfully deleted.",
          });

          // 2. redirect back to the current user's profile
          props.history.push(`/profile/${stateGlobal.userInfo.username}`);
        }
      } catch (e) {
        console.log("There was a problem.");
      }
    }
  }
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <ReactTooltip id="edit" className="custome-tooltip" />
            <a
              data-for="delete"
              data-tip="Delete"
              className="delete-post-button text-danger"
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to="#">
          <img
            className="avatar-tiny"
            src="https://www.gravatar.com/avatar/d2db8257c21036859a36bd7f6dab9cf3?s=800&d=identicon"
          />
        </Link>{" "}
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  );
}

export default withRouter(ViewSinglePost);
