import React from "react";
import ReactDOM from "react-dom"; //activates react
import Welcome from "./welcome";
import App from "./app";
// import Hello from "./hello";

let elem;

//if location.pathname is not /welcome, then (as the server must have determined) the user must be logged in
const userIsLoggedIn = location.pathname != "/welcome";

// console.log("location.pathname: ", location.pathname);

if (userIsLoggedIn) {
    elem = <App />;
    // elem = <Hello />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
