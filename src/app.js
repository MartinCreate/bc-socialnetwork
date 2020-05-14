import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FriendsAndWannabes from "./friends";

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
                    <div id="browser-router">
                        <div id="header">
                            <div id="logo-div">
                                <img
                                    src="/logo.png"
                                    alt="amjam logo"
                                    id="logo"
                                />
                                <br />
                                <a href="/logout" id="logout">
                                    Logout
                                </a>
                            </div>

                            <div id="navbar">
                                <Link
                                    to="/"
                                    id="nav-profile"
                                    className="nav-link"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/friends"
                                    id="nav-friends"
                                    className="nav-link"
                                >
                                    Friends
                                </Link>
                                <Link
                                    to="/users"
                                    id="nav-search"
                                    className="nav-link last-link"
                                >
                                    Find People
                                </Link>
                            </div>

                            <div id="header-pic">
                                <ProfilePic
                                    toggleModal={this.toggleModal}
                                    first={first}
                                    last={last}
                                    imageUrl={image_url}
                                />
                            </div>
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

                        <Route
                            exact
                            path="/friends"
                            component={FriendsAndWannabes}
                        />

                        <Route
                            exact
                            path="/users"
                            render={() => <FindPeople />}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
