export default function reducer(state = {}, action) {
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
        let friendsWannabes = state.friendsWannabes.filter(
            (user) => user.id != action.unfriendId
        );

        return { ...state, friendsWannabes };
    }

    return state;
}

//we never explicitly call the reducer(). it runs behind the scenes
