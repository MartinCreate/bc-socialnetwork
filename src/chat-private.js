import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPrivChatList, clearChatMessages } from "./actions";

import axios from "./axios";

export default function PrivateChat() {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [othId, setOthId] = useState();

    const elemRef = useRef(); //for autoscroll
    const privChatMessages = useSelector(
        (state) => state.privChatMessages && state.privChatMessages
    );
    const privChatsList = useSelector(
        (state) => state.privchats && state.privchats
    );

    useEffect(() => {
        dispatch(getPrivChatList());
        // dispatch(clearChatMessages());
    }, []);

    useEffect(() => {
        //render the chat with the most recently written message in the chat window
        if (privChatsList) {
            console.log("privChatsList: ", privChatsList);
            emitGetMsgs(privChatsList[0].other_id);
        }
    }, [privChatsList]);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privChatMessages]);

    useEffect(() => {
        console.log("search: ", search);
        let abort;
        (async () => {
            if (search) {
                const { data } = await axios.get(`/search-friends/${search}`);
                if (!abort && typeof data != "string") {
                    console.log(
                        "data in chat-private.js from GET search-friends: ",
                        data
                    );
                    setUsers(data);
                }
            }
        })();

        return () => {
            abort = true;
        };
    }, [search]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (privChatsList) {
                socket.emit("EnteredNewPrivMsg", [
                    e.target.value,
                    privChatsList[0].other_id,
                ]);
            } else {
                socket.emit("EnteredNewPrivMsg", [e.target.value, othId]);
            }

            e.target.value = "";
        }
    };

    const emitGetMsgs = (otherId) => {
        socket.emit("get private msgs", otherId);
    };

    const startChat = (otherId) => {
        document.getElementById("priv-chat-textarea").focus();
        socket.emit("get private msgs", otherId);
        setOthId(otherId);
    };

    return (
        <div id="chat-page" className="private">
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

            <div id="private-chat-container">
                <div id="priv-chats-list-container">
                    <div id="priv-chat-nav">
                        <div
                            onClick={() =>
                                console.log(
                                    "privChatsList in chat-private.js: ",
                                    privChatsList
                                )
                            }
                        >
                            Your Chats
                        </div>
                        <div className="input-field-div">
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="enter first or last name"
                                id="search-input"
                            />
                            <span className="focus-border"></span>
                        </div>
                        {/* <div>Start New Chat</div>
                        <div>Search Chats By Name</div> */}
                    </div>
                    <div id="priv-chats">
                        {/* generate list of chats here */}
                        {users &&
                            users.map((each) => (
                                <div
                                    className="priv-chat-list-item"
                                    key={each.id}
                                    onClick={() => startChat(each.id)}
                                    // emitGetMsgs(each.id)}
                                >
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                    <p>
                                        {each.first} {each.last}
                                    </p>
                                </div>
                            ))}
                        {privChatsList &&
                            privChatsList.map((each) => (
                                <div
                                    className="priv-chat-list-item"
                                    key={each.other_id}
                                    onClick={() => emitGetMsgs(each.other_id)}
                                >
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                    <p>
                                        {each.first} {each.last}
                                    </p>
                                </div>
                            ))}
                        {/* <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter</p>
                        </div>
                        <div className="priv-chat-list-item">
                            <img src="/default.png" />
                            <p>Example Chatter2</p>
                        </div> */}
                    </div>
                </div>
                {/* ref={elemRef} will let us autoscroll to the bottom */}
                <div className="chat-messages-container priv-chat-msgs-container">
                    <div id="chat-messages" ref={elemRef}>
                        {privChatMessages &&
                            privChatMessages.map((each) => (
                                <div
                                    className="message-container"
                                    key={each.m_id}
                                >
                                    <div className="img-container">
                                        <Link to={`/user/${each.sender_id}`}>
                                            <img
                                                src={
                                                    each.image_url ||
                                                    "/default.png"
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
                                        <p className="msg-text">
                                            {each.priv_msg}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <textarea
                        onKeyDown={keyCheck}
                        placeholder="Add your message here"
                        id="priv-chat-textarea"
                    />
                </div>
            </div>
        </div>
    );
}
