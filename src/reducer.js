export default function reducer(state = {}, action) {
    //3 different approaches for the first 3 reducers
    if (action.type === "GET_FRIENDS_WANNABES") {
        // here is where the code to update Redux global state will go

        state = Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        let friendsWannabes = state.friendsWannabes.map((x) => {
            if (x.id == action.newFriendId) {
                x.accepted = true;
                return x;
            } else {
                return x;
            }
        });

        return { ...state, friendsWannabes };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (user) => user.id != action.unfriendId
            ),
        };
    }

    if (action.type === "GET_LAST10_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }
    if (action.type === "NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg[0]],
        };
    }

    return state;
}

//we never explicitly call the reducer(). it runs behind the scenes
