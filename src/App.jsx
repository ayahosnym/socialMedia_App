import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import StateGlobal from "./StateGlobal";
import DispatchGlobal from "./DispatchGlobal";

// my components
import Header from "./components/Header/Header";
import HomeGuest from "./components/HomeGuest/HomeGuest";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Terms from "./components/Terms/Terms";
import CreatePost from "./components/CreatePost/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile/Profile";
import EditPost from "./components/EditPost/EditPost";
import Search from "./components/Search/Search";
import NotFound from "./components/NotFound";
//
import Axios from "axios";
import Chat from "./components/Chat";
Axios.defaults.baseURL = "http://localhost:8080";

export default function App() {
  // inital valu to state
  const initialState = {
    checkUserLogged: Boolean(localStorage.getItem("currentUserToken")),
    flashMessages: [],
    userInfo: {
      token: localStorage.getItem("currentUserToken"),
      username: localStorage.getItem("currentUserName"),
      avatar: localStorage.getItem("currentUserAvatar"),
    },
    searchOverlay: false,
    isChatOpen: false,
  };

  //
  function reducers(copyState, action) {
    switch (action.type) {
      case "login":
        copyState.checkUserLogged = true;
        copyState.userInfo = action.data;
        break;
      case "logout":
        copyState.checkUserLogged = false;
        break;
      case "flashMessage":
        copyState.flashMessages.push(action.value);
        break;
      case "openSearch":
        copyState.searchOverlay = true;
        break;
      case "closeSearch":
        copyState.searchOverlay = false;
        break;
      case "closeChat":
        copyState.isChatOpen = false;
        break;
      case "chatToggle":
        copyState.isChatOpen = !copyState.isChatOpen;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(reducers, initialState);

  useEffect(() => {
    if (state.checkUserLogged) {
      window.localStorage.setItem("currentUserToken", state.userInfo.token);
      window.localStorage.setItem("currentUserName", state.userInfo.username);
      window.localStorage.setItem("currentUserAvatar", state.userInfo.avatar);
    } else {
      localStorage.removeItem("currentUserToken");
      localStorage.removeItem("currentUserAvatar");
      localStorage.removeItem("currentUserName");
    }
  }, [state.checkUserLogged]);

  return (
    <StateGlobal.Provider value={state}>
      <DispatchGlobal.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route exact path="/">
              {state.checkUserLogged ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {state.searchOverlay ? <Search /> : ""}
          {state.isChatOpen ? <Chat /> : ""}
          <Footer />
        </BrowserRouter>
      </DispatchGlobal.Provider>
    </StateGlobal.Provider>
  );
}

if (module.hot) {
  module.hot.accept();
}
