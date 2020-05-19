import axios from "./axios";

////------------------------------- /friends page -----------------------------------------------------//
export async function getFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");

    return {
        type: "GET_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function acceptFriend(otherId) {
    await axios.post(`/friend-status/${otherId}`, {
        kind: "Accept Friend Request",
    });

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        newFriendId: otherId,
    };
}
export async function unfriend(otherId) {
    await axios.post(`/friend-status/${otherId}`, {
        kind: "Unfriend",
    });

    return {
        type: "UNFRIEND",
        unfriendId: otherId,
    };
}

////------------------------------- /chat page -----------------------------------------------------//
export function chatMessages(msgs) {
    return {
        type: "GET_LAST10_MESSAGES",
        msgs: msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "NEW_MESSAGE",
        msg: msg,
    };
}

////------------------------------- /private-chat page -----------------------------------------------------//
export async function getPrivChatList() {
    const { data } = await axios.get("/private-chat-info");
    console.log("data in getLeftColInfo: ", data);

    if (data.length == 0) {
        console.log("we're in NO_PRIV_CHATS now");
        return {
            type: "NO_PRIVCHATS",
        };
    } else {
        console.log("we're in GET_PRIVCHAT_LIST  now");
        return {
            type: "GET_PRIVCHAT_LIST",
            privchats: data,
        };
    }
}
export function clearChatMessages() {
    return {
        type: "CLEAR_CHAT_MSGS",
        msgs: [],
    };
}
export function privChatMsgs(msgs) {
    return {
        type: "GET_LAST_PRIV_MESSAGES",
        msgs: msgs,
    };
}

export function privChatMsgCheck(msg) {
    return {
        type: "NEW_PRIV_MESSAGE_CHECK",
        msg: msg,
    };
}

export function privChatMsg(msg) {
    return {
        type: "NEW_PRIV_MESSAGE",
        msg: msg,
    };
}
