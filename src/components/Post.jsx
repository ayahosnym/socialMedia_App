import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Post(props) {
  const { post, onClick } = props;
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link
      key={post._id}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
      onClick={onClick}
    >
      <img className="avatar-tiny" src='https://www.gravatar.com/avatar/d2db8257c21036859a36bd7f6dab9cf3?s=800&d=identicon' />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">{dateFormatted}</span>
    </Link>
  );
}
