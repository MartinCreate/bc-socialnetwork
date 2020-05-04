// import HelloWorld from "./helloworld"; // since we exported using default in helloworld.js, we don't need the curly brackets here
// // ReactDOM.render(<HelloWorld />, document.querySelector("main"));
import React from "react";
import ReactDOM from "react-dom"; //activates react
import Welcome from "./welcome";

//for logout
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

let elem;

//if location.pathname is not /welcome, then (as the server must have determined) the user must be logged in
const userIsLoggedIn = location.pathname != "/welcome";

console.log("location.pathname: ", location.pathname);

if (userIsLoggedIn) {
    elem = (
        <div>
            {/* <h1>I will be the logo...</h1> */}
            <img src="./logo4.png" alt="amjam logo" id="logo" />
            <a href="/logout">Logout</a>
        </div>
    );
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
