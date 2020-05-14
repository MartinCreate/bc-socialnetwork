import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsWannabes } from "./actions";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == true)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == false)
    );

    useEffect(() => {
        dispatch(getFriendsWannabes());
    }, []);

    return (
        <div id="friends-page">
            <div id="friends-list">
                <h2 onClick={() => console.log("friends: ", friends)}>
                    Friends
                </h2>
                <p>Friends Go Here :D</p>
                {/* {friends.map((each) => (
                    <Link to={`/user/${each.id}`} key={each.id}>
                        <div className="search-result" key={each.id}>
                            <img src={each.image_url || "/default.png"} />
                            <p>
                                {each.first} {each.last}
                            </p>
                            <button>Unfriend</button>
                        </div>
                    </Link>
                ))} */}
            </div>
            <div id="wannabes-list">
                <h2 onClick={() => console.log("wannabes: ", wannabes)}>
                    Wannabes
                </h2>
                <p>Wannabes Go Here :D</p>
            </div>
        </div>
    );
}
