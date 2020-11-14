import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

export default function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoops, this page Not Found</h2>
        <p>
          Go to<Link to="/">Home Page</Link>
        </p>
      </div>
    </Page>
  );
}
