import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
//-----socket.io -- giving socket.js file access to Redux
import { init } from "./socket";
//-------Redux boiler plate below
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux"; //integrates redux with react
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

//store contains global state and methods used to update and access global state
//reducer updates the global state
//reduxPromise allows our actionCreators to return promises (needed for axios.get/post)
//composeWithDevTools allows us to use the Redux devtools chrome extension
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
//-------Redux boiler plate above

let elem;

const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    init(store); //socket.io connection (only logged-in users should be able to dispatch from our sockets)
    elem = (
        //provider allows any component in App to interact with the global store (which we pass as a prop in <Provider>)
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
