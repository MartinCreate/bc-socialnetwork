import React, { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPrivChatList, privChatMsg } from "./actions";

import axios from "./axios";

export default function PrivateChat() {
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [othId, setOthId] = useState();
    const [myIdAndSocket, setmyIdAndSocket] = useState([]);
    const elemRef = useRef(); //for autoscroll
    const myId = useSelector((state) => state.myId && state.myId);
    const privChatMessages = useSelector(
        (state) => state.privChatMessages && state.privChatMessages
    );
    const privChatsList = useSelector(
        (state) => state.privchats && state.privchats
    );
    const newPrivMsg = useSelector(
        (state) => state.newPrivMsg && state.newPrivMsg
    );
    const newPrivMsgFrom = useSelector(
        (state) => state.newMsgFrom && state.newMsgFrom
    );
    const onlineUsers = useSelector(
        //NOTE: onlineUsers[i].socket[0] is the most recent socket for that user
        (state) => state.socketIds && state.socketIds
    );
    const newLogin = useSelector((state) => state.newLogin && state.newLogin);

    useEffect(() => {
        dispatch(getPrivChatList());
        socket.emit("openedPrivateChat");

        setMounted(true);
    }, []);

    useEffect(() => {
        if (privChatsList) {
            emitGetMsgs(privChatsList[0].other_id);

            const elems = document.getElementsByClassName(
                "priv-chat-list-item"
            );
            elems[0].classList.add("current-chat");
        }
    }, [privChatsList]);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privChatMessages]);

    useEffect(() => {
        if (newPrivMsg) {
            const recId = newPrivMsg[0].receiver_id;
            const senId = newPrivMsg[0].sender_id; //could this cause problems??
            if (recId == othId || senId == othId) {
                dispatch(privChatMsg(newPrivMsg));
            }
        }

        if (newPrivMsgFrom && newPrivMsg) {
            console.log("In newPrivMsg");
            console.log("othId in newPrivMsg: ", othId);
            console.log("newPrivMsgFrom in newPrivMsg: ", newPrivMsgFrom);
        }
    }, [newPrivMsg]);

    useEffect(() => {
        if (
            mounted &&
            newPrivMsgFrom &&
            myId &&
            newPrivMsgFrom != myId &&
            newPrivMsgFrom != othId
        ) {
            const elem = document.getElementsByClassName("priv-chat-list-item");
            const ind = findInd(privChatsList, "other_id", newPrivMsgFrom);
            elem[ind].classList.remove("incoming-msg");
            elem[ind].classList.add("incoming-msg");
        }
    }, [newPrivMsgFrom]);

    useEffect(() => {
        let abort;
        (async () => {
            if (search) {
                const { data } = await axios.get(`/search-friends/${search}`);
                if (!abort && typeof data != "string") {
                    console.log("data from GET search-friends: ", data);

                    //Adding highlight class
                    let filteredSearch = data.map((x) => {
                        privChatsList.map((y) => {
                            if (y.other_id == x.id || x.hasChat) {
                                x.hasChat = "srch-hasChat";
                                return y;
                            } else {
                                return y;
                            }
                        });
                        return x;
                    });

                    setUsers(filteredSearch);
                }
            } else {
                setUsers([]);
            }
        })();

        return () => {
            abort = true;
        };
    }, [search]);

    useEffect(() => {
        if (onlineUsers) {
            if (onlineUsers.length == 1) {
                setmyIdAndSocket(onlineUsers);
            }
            console.log("onlineUsers: ", onlineUsers);
        }
    }, [onlineUsers]);

    useEffect(() => {
        if (newLogin && myId) {
            if (newLogin[0].id != myId) {
                socket.emit("updateOnlineUsers", [
                    myIdAndSocket[0],
                    newLogin[0],
                ]);
            }
        }
    }, [newLogin]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (e.target.value == "") {
                return;
            }

            const othSock = socketById(othId);
            socket.emit("sendPrivMsg", [e.target.value, othId, othSock]);

            e.target.value = "";

            dispatch(getPrivChatList());
            setUsers([]);
            document.getElementById("search-input").value = "";
        }
    };

    const emitGetMsgs = (otherId) => {
        socket.emit("get private msgs", otherId);
        setOthId(otherId);
    };

    const startChat = (e, otherId) => {
        e.stopPropagation();

        e.currentTarget.classList.remove("incoming-msg");

        const elem = document.getElementsByClassName("current-chat")[0];
        elem && elem.classList.remove("current-chat");

        document.getElementById("priv-chat-textarea").value = "";
        document.getElementById("priv-chat-textarea").focus();
        e.currentTarget.classList.add("current-chat");

        emitGetMsgs(otherId);
    };

    const findInd = (arr, prop, val) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === val) {
                return i;
            }
        }
    };

    const socketById = (otherId) => {
        const indRec = findInd(onlineUsers, "id", otherId);
        console.log("indRec: ", indRec);
        if (indRec) {
            return onlineUsers[indRec].socket[0];
        } else {
            return null;
        }
    };

    return (
        <div id="chat-page" className="private">
            <div className="navbar chat-navbar">
                <Link to="/public-chat" className="nav-link">
                    Public Chat
                </Link>
                <Link
                    to="/private-chat"
                    id="nav-private-privchat"
                    className="nav-link last-link"
                >
                    Private Chat
                </Link>
            </div>

            <div id="private-chat-container">
                <div id="priv-chats-list-container">
                    <div id="priv-nav">
                        <div
                            id="priv-nav-header"
                            onClick={() =>
                                console.log(
                                    "privChatsList in chat-private.js: ",
                                    privChatsList
                                )
                            }
                        >
                            Search Friends
                        </div>
                        <div className="input-field-div">
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="enter first or last name"
                                id="search-input"
                            />
                            <span className="focus-border"></span>
                        </div>
                    </div>

                    <div id="priv-chats">
                        {users &&
                            users.map((each) => (
                                <div
                                    className={`priv-chat-list-item priv-search-result ${each.hasChat}`}
                                    key={each.id}
                                    onClick={(e) => startChat(e, each.id)}
                                >
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                    <p className="privlist-name">
                                        {each.first} {each.last}
                                    </p>
                                </div>
                            ))}
                        {privChatsList &&
                            privChatsList.map((each) => (
                                <div
                                    className="priv-chat-list-item"
                                    key={each.other_id}
                                    onClick={(e) => startChat(e, each.other_id)}
                                >
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                    <p className="privlist-name">
                                        {each.first} {each.last}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

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
