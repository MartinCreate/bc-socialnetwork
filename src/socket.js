import * as io from "socket.io-client";

import {
    chatMessages,
    chatMessage,
    privChatMsgs,
    privChatMsgCheck,
    privMsgAlert,
    myId,
    myIS,
    othIS,
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

        socket.on("newPrivMsgAlert", (id) => store.dispatch(privMsgAlert(id)));
        // socket.on("newPrivMsgAlert", (id) => {
        //     console.log("id in newPrivMsgAlert socket.js: ", id);
        //     store.dispatch(privMsgAlert(id));
        // });

        socket.on("store_myId", (id) => store.dispatch(myId(id)));

        // socket.on("storeIdAndSocket", (idSock) => store.dispatch(myIS(idSock)));
        socket.on("storeIdAndSocket", (idSock) => {
            // console.log("idSock in socket.js: ", idSock);

            store.dispatch(myIS(idSock));

            //this runs on my clientside when another user logs in. use this to trigger an event that sends them my onlineUsers array
        });
        socket.on("updateSockets", (idSock) => {
            // console.log("socket.js updateSocket idSock: ", idSock);

            store.dispatch(othIS(idSock));
        });
    }
};
