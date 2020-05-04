import React from "react";
import { HashRouter, Route } from "react-router-dom";
//this will hold the registration component
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";

export default function Welcome() {
    return (
        <div className="welcome-component">
            <div className="welcome-backdrop">
                <h1>Welcome to amJam!</h1>
                <p className="subTitle">
                    Organise casual jam sessions with musicians in your area!
                </p>

                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={ResetPassword} />
                    </div>
                </HashRouter>

                {/* <Registration /> */}
            </div>
        </div>
    );
}
