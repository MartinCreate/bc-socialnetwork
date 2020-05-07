import React, { Component } from "react";
import axios from "axios";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        console.log("this.props.match.params.id: ", this.props.match.params.id);
        const otherId = this.props.match.params.id;

        try {
            const { data } = await axios.get("/other-user/" + otherId);
            if (data.ownProfile) {
                this.props.history.push("/");
            } else {
                const { first, last, email, image_url, bio } = data;

                this.setState({
                    otherId: otherId,
                    first: first,
                    last: last,
                    email: email,
                    img_url: image_url || "/default.png",
                    bio: bio,
                });
            }
        } catch (e) {
            console.log("ERROR in other-profile.js get /user/id: ");
        }
    }

    render() {
        return (
            <div id="profile-component">
                <div id="pic-inProfile">
                    <div className="other-prof prof-pic-div">
                        <img
                            src={this.state.img_url}
                            className="profile-pic"
                            alt={`${this.state.first} ${this.state.last}'s profile picture`}
                        />
                    </div>
                </div>
                <div id="bio-div">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <h3>Profile</h3>
                    <div id="bio-editor">
                        {this.state.bio && (
                            <p id="bio-text">{this.state.bio}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default OtherProfile;
