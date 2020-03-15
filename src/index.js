import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import History from "../src/History";
import Home from "../src/Components/Home";
import View from "../src/Components/View";
import UploadImages from "../src/Components/UploadImages";
import * as serviceWorker from "./serviceWorker";

const routing = (
  <Router history={History}>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/View" component={View} />
        <Route path="/UploadImages" component={UploadImages} />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
