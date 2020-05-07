import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";

//NEW below
import OtherProfile from "./other-profile";
import { BrowserRouter, Route } from "react-router-dom";

//reacty styling
// const stylesApp = {
//     backgroundColor: "blue",
// };

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

    //refactoring componentDidMount with async & await
    // async componentDidMount() {
    //     const { data } = await axios.get("/user");
    //     console.log("componentDidMount data: ", data);

    //     this.setState({
    //         first: data.first,
    //         last: data.last,
    //         id: data.id,
    //         imageUrl: data.image_url,
    //     });
    // }

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            // console.log("componentDidMount data: ", data);
            this.setState(data);
            // this.setState({
            //     first: data.first,
            //     last: data.last,
            //     id: data.id,
            //     imageUrl: data.image_url,
            //     bio: data.bio,
            // });
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setImgUrl(imgUrl) {
        this.setState({
            imageUrl: imgUrl,
            uploaderIsVisible: false,
        });
    }

    updateBio(draft) {
        // console.log("draft: ", draft);
        this.setState({
            bio: draft,
        });
    }

    render() {
        const { id, first, last, image_url, bio } = this.state;
        //you pass information from parent to child through attributes in the child's html tag as seen in <ProfilePic/> below
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
                            {/* styles={stylesApp} */}
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

                        {/* <Profile
                            toggleModal={this.toggleModal}
                            id={this.state.id}
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            bio={this.state.bio}
                            updateBio={this.updateBio}
                        /> */}

                        {/* Route checks the url path and loads the component corresponding to the value in component={}. this only works if you're not passing the component any attributes */}
                        {/* <Route exact path="/chat" component={chat} />
                        <Route exact path="/online" component={OnlineUsers} /> */}

                        {/* To use route with components to which data is passed through attributes, use render={() => {<ExampleComponent />}}  */}
                        {/* "only render Profile, when the path is exactly '/' " */}
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
                                    currentUserId={id}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
