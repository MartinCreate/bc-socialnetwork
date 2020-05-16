import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsWannabes, acceptFriend, unfriend } from "./actions";

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

    //attempt at refactoring
    // function renderList(friendOrWannabe, buttonLabel, action) {
    //     return friendOrWannabe.map((each) => (
    //         <div className="search-result" key={each.id}>
    //             <Link to={`/user/${each.id}`} key={each.id}>
    //                 <img src={each.image_url || "/default.png"} />
    //             </Link>
    //             <div>
    //                 <Link to={`/user/${each.id}`} key={each.id}>
    //                     <p>
    //                         {each.first} {each.last}
    //                     </p>
    //                 </Link>
    //                 <button
    //                     onClick={() => {
    //                         dispatch(action(each.id)); //this doesn't work
    //                     }}
    //                 >
    //                     {buttonLabel}
    //                 </button>
    //             </div>
    //         </div>
    //     ));
    // }

    return (
        <div id="friends-page">
            <div id="friends-container">
                <p>
                    <span> Friends</span>{" "}
                    <span>({friends && friends.length})</span>
                </p>
                <div id="friends-list" className="friends-lists">
                    {friends &&
                        friends.map((each) => (
                            <div className="search-result" key={each.id}>
                                <Link to={`/user/${each.id}`} key={each.id}>
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                </Link>
                                <div className="name-and-buttons">
                                    <p>
                                        <Link
                                            to={`/user/${each.id}`}
                                            key={each.id}
                                            className="name-link"
                                        >
                                            {each.first} {each.last}
                                        </Link>
                                    </p>
                                    <div>
                                        <button
                                            onClick={() => {
                                                dispatch(unfriend(each.id));
                                            }}
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div id="wannabes-container">
                <p>
                    <span>Friend Requests</span>{" "}
                    <span>({wannabes && wannabes.length})</span>
                </p>
                <div id="wannabes-list" className="friends-lists">
                    {wannabes &&
                        wannabes.map((each) => (
                            <div className="search-result" key={each.id}>
                                <Link to={`/user/${each.id}`} key={each.id}>
                                    <img
                                        src={each.image_url || "/default.png"}
                                    />
                                </Link>
                                <div className="name-and-buttons">
                                    <p>
                                        <Link
                                            to={`/user/${each.id}`}
                                            key={each.id}
                                            className="name-link"
                                        >
                                            {each.first} {each.last}{" "}
                                        </Link>
                                    </p>
                                    <div>
                                        <button
                                            onClick={() => {
                                                dispatch(acceptFriend(each.id));
                                            }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => {
                                                dispatch(unfriend(each.id));
                                            }}
                                            className="decline-button"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
