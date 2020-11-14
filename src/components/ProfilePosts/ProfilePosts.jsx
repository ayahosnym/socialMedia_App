import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Page from "../Page";
import Post from "../Post";
import LoadingIcon from "../LoadingIcon";
import "./ProfilePosts.css";

export default function ProfilePosts() {
  const [isLoading, setIsloading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();
  useEffect(() => {
    async function getPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`);
        setPosts(response.data);
        setIsloading(false);
        console.log(response.data);
      } catch (error) {
        console.log("error");
      }
    }
    getPosts();
  }, [username]);

  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  return (
    <>
      <div className="list-group">
        {posts.map((post, index) => {
          return <Post post={post} key={index} />;
        })}
      </div>
    </>
  );
}
