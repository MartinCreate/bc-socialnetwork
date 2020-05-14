import axios from "./axios";

export async function getFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("data in actions.js: ", data);
    return {
        type: "GET_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

//action creator functions go here

// export function exampleAction() {
//     return {
//         type: "EXAMPLE_ACTION",
//     };
// }

// export function exampleAction2() {
//     return {
//         type: "EXAMPLE_ACTION2",
//     };
// }

//etc.
