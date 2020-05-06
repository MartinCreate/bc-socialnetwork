import React from "react";
import ReactDOM from "react-dom"; //activates react
import Welcome from "./welcome"; // since we exported using default in welcome.js, we don't need the curly brackets here
import App from "./app";

let elem;

//if location.pathname is not /welcome, then (as the server must have determined) the user must be logged in
const userIsLoggedIn = location.pathname != "/welcome";

console.log("location.pathname: ", location.pathname);

if (userIsLoggedIn) {
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
