import React, { useState, useEffect } from "react";
import axios from "./axios";
//props from other-profile.js

export default function FriendshipButton({ otherId }) {
    const [buttonText, setButtonText] = useState("WANT SUM FUK?");

    useEffect(() => {
        console.log("I am friendButton, hear me roar");

        axios.get(`/friend-status/${otherId}`).then(({ data }) => {
            console.log("data from GET: ", data);
            setButtonText(data);
        });
    }, []);

    function submit() {
        console.log("submit() button is operational", buttonText);

        const what = { kind: buttonText };

        axios.post(`/friend-status/${otherId}`, what).then(({ data }) => {
            console.log("data from POST: ", data);
            setButtonText(data);
        });
    }

    return (
        <div id="friend-info">
            <p></p>
            <button className="btn" onClick={() => submit()}>
                {buttonText}
            </button>
        </div>
    );
}
