import React, { useState, useEffect } from "react";
import axios from "./axios";
//props from other-profile.js

export default function FriendshipButton({ otherId, first, last }) {
    const [buttonText, setButtonText] = useState("");
    useEffect(() => {
        console.log("I am friendButton, hear me roar");

        axios.get(`/friend-status/${otherId}`).then(({ data }) => {
            console.log("data from GET: ", data);
            setButtonText(data);
        });
    }, []);

    function submit() {
        console.log("submit() button is operational", buttonText);

        if (buttonText == "Unfriend") {
            if (confirm("Are you sure you want to unfriend this person?")) {
                const what = { kind: buttonText };

                axios
                    .post(`/friend-status/${otherId}`, what)
                    .then(({ data }) => {
                        console.log("data from POST: ", data);
                        setButtonText(data);
                    });
            }
        }
    }

    return (
        <div id="friend-info">
            {buttonText == "Make Friend Request" && <p>Stranger</p>}
            {buttonText == "Cancel Friend Request" && (
                <p>You sent a Friend Request</p>
            )}
            {buttonText == "Accept Friend Request" && (
                <p>
                    {first} {last} sent a Friend Request
                </p>
            )}
            {buttonText == "Unfriend" && (
                <p>
                    {first} {last} is your friend
                </p>
            )}
            <button className="btn" onClick={() => submit()}>
                {buttonText}
            </button>
        </div>
    );
}
