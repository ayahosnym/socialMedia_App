import React from "react";

export default function Container(props) {
  return (
    <section className="container container--narrow py-md-5">
      {props.children}
    </section>
  );
}
