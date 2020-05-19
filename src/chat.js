import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector(
        (state) => state.chatMessages && state.chatMessages
    );

    useEffect(() => {
        socket.emit("get10LastPublicMessages");
    }, []);

    useEffect(() => {
        // console.log("chat hooks component has mounted");
        // console.log("elemRef: ", elemRef);
        // console.log("scroll top: ", elemRef.current.scrollTop);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        // console.log("scrollHeight: ", elemRef.current.scrollHeight);

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        console.log("value: ", e.target.value);
        console.log("key pressed: ", e.key); //e.key only possible because we're using transpiler (older browsers won't support it otherwise)

        if (e.key === "Enter") {
            e.preventDefault(); //prevents going to next line upon hitting Enter

            socket.emit("Entered newChatMsg", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div id="chat-page">
            <div className="navbar chat-navbar">
                <Link to="/chat" id="nav-global-chat" className="nav-link">
                    Public Chat
                </Link>
                <Link
                    to="/private-chat"
                    id="nav-private-chat"
                    className="nav-link last-link"
                >
                    Private Chat
                </Link>
            </div>

            <div className="chat-messages-container">
                {/* ref={elemRef} will let us autoscroll to the bottom */}
                <div id="chat-messages" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((each) => (
                            <div className="message-container" key={each.m_id}>
                                <div className="img-container">
                                    <Link to={`/user/${each.msg_sender_id}`}>
                                        <img
                                            src={
                                                each.image_url || "/default.png"
                                            }
                                        />
                                    </Link>
                                </div>
                                <div className="message-div">
                                    <div className="msg-name-time">
                                        <p>
                                            {each.first} {each.last}
                                        </p>
                                        <p>{each.created_at}</p>
                                    </div>
                                    <p className="msg-text">{each.chat_msg}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <textarea
                    onKeyDown={keyCheck}
                    placeholder="Add your message here"
                />
            </div>
        </div>
    );
}
