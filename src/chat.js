import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// import { chatMessages, chatMessage } from "./actions";

///

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector(
        (state) => state.chatMessages && state.chatMessages
    );

    //CHANGE THIS SO THAT IT RUNS EVERY TIME WE GET A NEW CHAT MESSAGE
    useEffect(() => {
        // console.log("chat hooks component has mounted");
        // console.log("elemRef: ", elemRef);
        // console.log("scroll top: ", elemRef.current.scrollTop);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        // console.log("scrollHeight: ", elemRef.current.scrollHeight);

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    //this will be undefined until i create table, and finish my db.query
    console.log("here are my last 10 chat messages: ", chatMessages);

    const keyCheck = (e) => {
        console.log("value: ", e.target.value);
        console.log("key pressed: ", e.key); //e.key only possible because we're using transpiler (older browsers won't support it otherwise)

        if (e.key === "Enter") {
            e.preventDefault(); //prevents going to next line upon hitting Enter
            // console.log("e.target.value: ", e.target.value);

            //when user hits enter in chat, emit event
            socket.emit("Entered newChatMsg", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div id="chat-page">
            <p onClick={() => console.log("chatMessages:", chatMessages)}>
                Welcome to the global Chat!
            </p>
            <div id="chat-messages-container">
                {/* ref={elemRef} will let us autoscroll to the bottom */}
                <div id="chat-messages" ref={elemRef}>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    <p>example chate message</p>
                    {chatMessages &&
                        chatMessages.map((each) => (
                            <div className="message-container" key={each.id}>
                                <img src={each.image_url || "/default.png"} />
                                <div className="message-div">
                                    <p className="messenger">
                                        {each.first} {each.last}{" "}
                                        <span className="msg-time">
                                            {each.created_at}
                                        </span>
                                    </p>
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
