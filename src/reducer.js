export default function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS_WANNABES") {
        // here is where the code to update Redux global state will go
        console.log(
            "action.friendsWannabes in reducer.js: ",
            action.friendsWannabes
        );

        state = Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    }

    return state;
}

//we never explicitly call the reducer(). it runs behind the scenes
