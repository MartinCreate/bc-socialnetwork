import React from "react";
import Registration from "./registration";
//this will hold the registration component

export default function Welcome() {
    return (
        <div className="welcome-component">
            <div className="welcome-backdrop">
                <h1>Welcome to JamSession!</h1>
                <p className="subTitle">Connect with musicians in your area!</p>
                <Registration />
            </div>
        </div>
    );
}
