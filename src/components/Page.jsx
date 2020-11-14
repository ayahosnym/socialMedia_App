import React, { useEffect } from "react";
import Container from "./Container";

export default function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Social App`;
    window.scrollTo(0, 0);
  });
  return <Container children={props.children}></Container>;
}
