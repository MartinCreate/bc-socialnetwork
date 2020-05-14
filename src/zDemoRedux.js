//BoilerPlate
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducer";

const store = createStore(reducer, applyMiddleware(reduxPromise));
//BP
