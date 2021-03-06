import React, { Component } from "react";
import axios from "axios";
import FriendshipButton from "./friend-button";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const otherId = this.props.match.params.id;

        try {
            const { data } = await axios.get("/other-user/" + otherId);
            if (data.nonExistentIdOrOwnProfile) {
                this.props.history.push("/");
            } else {
                const { first, last, image_url, bio } = data;

                this.setState({
                    first: first,
                    last: last,
                    img_url: image_url || "/default.png",
                    bio: bio,
                });
            }
        } catch (e) {
            console.log("ERROR in other-profile.js get /user/id: ");
        }
    }

    render() {
        const { first, last, img_url, bio } = this.state;

        return (
            <div id="profile-component">
                <div id="pic-inProfile">
                    <div className="other-prof prof-pic-div">
                        <img
                            src={img_url}
                            className="profile-pic"
                            alt={`${first} ${last}'s profile picture`}
                        />
                        <FriendshipButton
                            otherId={this.props.match.params.id}
                            first={first}
                            last={last}
                        />
                    </div>
                </div>
                <div id="bio-div">
                    <h1>
                        {first} {last}
                    </h1>
                    <h3>Profile</h3>
                    <div id="bio-editor">
                        {bio && <p id="bio-text">{bio}</p>}
                    </div>
                </div>
            </div>
        );
    }
}
