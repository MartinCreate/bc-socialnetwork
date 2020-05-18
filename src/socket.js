import * as io from "socket.io-client";

import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last10Msgs", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("newChatMsg", (msg) => store.dispatch(chatMessage(msg)));
    }
};
