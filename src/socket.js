import * as io from "socket.io-client";

import {
    chatMessages,
    chatMessage,
    privChatMsgs,
    privChatMsgCheck,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        //--- public chat ---//
        socket.on("last10Msgs", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("newChatMsg", (msg) => store.dispatch(chatMessage(msg)));

        //--- private chat ---//
        socket.on("lastPrivMsgs", (msgs) => store.dispatch(privChatMsgs(msgs)));

        socket.on("newPrivMsg", (msg) => store.dispatch(privChatMsgCheck(msg)));
    }
};
