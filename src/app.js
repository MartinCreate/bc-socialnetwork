import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.setImgUrl = this.setImgUrl.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.updateBio = this.updateBio.bind(this);

        this.state = {
            uploaderIsVisible: false,
        };
    }

    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState(data);
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setImgUrl(imgUrl) {
        this.setState({
            image_url: imgUrl,
            uploaderIsVisible: false,
        });
    }

    updateBio(draft) {
        this.setState({
            bio: draft,
        });
    }

    render() {
        const { id, first, last, image_url, bio } = this.state;

        return (
            <div id="app-component">
                <BrowserRouter>
                    <div>
                        <div id="header">
                            <div id="logo-div">
                                <img
                                    src="/logo4.png"
                                    alt="amjam logo"
                                    id="logo"
                                />
                                <br />
                                <a href="/logout" id="logout">
                                    Logout
                                </a>
                            </div>

                            <ProfilePic
                                toggleModal={this.toggleModal}
                                first={first}
                                last={last}
                                imageUrl={image_url}
                            />
                        </div>
                        {this.state.uploaderIsVisible && (
                            <div id="upload-container">
                                <Uploader
                                    setImgUrl={this.setImgUrl}
                                    toggleModal={this.toggleModal}
                                    id={id}
                                />
                            </div>
                        )}

                        {/* <Route /> without attributes:
                        <Route exact path="/online" component={OnlineUsers} /> */}

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    toggleModal={this.toggleModal}
                                    id={id}
                                    first={first}
                                    last={last}
                                    imageUrl={image_url}
                                    bio={bio}
                                    updateBio={this.updateBio}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
