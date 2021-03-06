import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FriendsAndWannabes from "./friends";
import Chat from "./chat";
import PrivateChat from "./chat-private";

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

        const elem = document.getElementsByClassName("current-navtab")[0];
        elem && elem.classList.remove("current-navtab");

        //Highlighting current Tab
        const pathname = window.location.pathname;
        const p2 = pathname.substr(1);
        const tab = document.getElementsByClassName(p2)[0];
        if (tab) {
            tab.classList.add("current-navtab");
        } else {
            document
                .getElementsByClassName("profile")[0]
                .classList.add("current-navtab");
        }
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

    addHighlight(e) {
        const elem = document.getElementsByClassName("current-navtab")[0];
        elem && elem.classList.remove("current-navtab");
        e.currentTarget.classList.add("current-navtab");
    }

    render() {
        const { id, first, last, image_url, bio } = this.state;

        return (
            <div id="app-component">
                <BrowserRouter>
                    <div id="browser-router">
                        <div id="header">
                            <div id="logo-div">
                                <Link to="/">
                                    <img
                                        src="/logo.png"
                                        alt="amjam logo"
                                        id="logo"
                                    />
                                </Link>
                                <br />
                                <a href="/logout" id="logout">
                                    Logout
                                </a>
                            </div>

                            <div className="navbar">
                                <Link
                                    to="/"
                                    id="nav-profile"
                                    className="nav-link profile"
                                    onClick={(e) => this.addHighlight(e)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/friends"
                                    id="nav-friends"
                                    className="nav-link friends"
                                    onClick={(e) => this.addHighlight(e)}
                                >
                                    Friends
                                </Link>
                                <Link
                                    to="/users"
                                    id="nav-search"
                                    className="nav-link users"
                                    onClick={(e) => this.addHighlight(e)}
                                >
                                    Search
                                </Link>
                                <Link
                                    to="/private-chat"
                                    id="nav-chat"
                                    className="nav-link private-chat last-link"
                                    onClick={(e) => this.addHighlight(e)}
                                >
                                    Chat
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

                        <Route exact path="/users" component={FindPeople} />
                        <Route exact path="/public-chat" component={Chat} />
                        <Route
                            exact
                            path="/private-chat"
                            component={PrivateChat}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
