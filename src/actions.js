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
export async function chatMessages(msgs) {
    return {
        type: "GET_LAST10_MESSAGES",
        msgs: msgs,
    };
}

export async function chatMessage(msg) {
    return {
        type: "NEW_MESSAGE",
        msg: msg,
    };
}
