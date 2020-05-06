import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
//new below
import Profile from "./profile";

// const stylesApp = {
//     backgroundColor: "blue",
// };

export default class App extends React.Component {
    constructor() {
        super();
        this.setImgUrl = this.setImgUrl.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.cancelBio = this.cancelBio.bind(this);

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
            console.log("componentDidMount data: ", data);
            this.setState({
                first: data.first,
                last: data.last,
                id: data.id,
                imageUrl: data.image_url,
                bio: data.bio,
                // bio: "A wild Test-Bio has appeared!",
            });
        });
    }

    toggleModal() {
        // console.log("toggleModal is running!");
        this.setState({
            //the value in the line below reads: 'whatever the value is in uploaderIsVisible, change it to the opposite'
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    //demo
    // methodInApp(imgUrl) {
    //     console.log("I'm running in App! arg: ", arg);
    // }

    setImgUrl(imgUrl) {
        this.setState({
            imageUrl: imgUrl,
            uploaderIsVisible: false,
        });
    }

    updateBio(e) {
        // console.log("updateBio e.taget.value: ", e.target.value);
        console.log("e: ", e);
        this.setState({
            bio: e.target.value || e,
        });
    }

    cancelBio(orig) {
        console.log("orig: ", orig);
        this.setState({
            bio: "poop",
        });
    }

    render() {
        //you pass information from parent to child through attributes in the child's html tag as seen in <ProfilePic/> below
        return (
            <div id="app-component">
                <div id="header">
                    <div id="logo-div">
                        <img src="./logo4.png" alt="amjam logo" id="logo" />
                        <br />
                        <a href="/logout" id="logout">
                            Logout
                        </a>
                    </div>

                    <ProfilePic
                        toggleModal={this.toggleModal}
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                    {/* styles={stylesApp} */}
                </div>
                {this.state.uploaderIsVisible && (
                    <div id="upload-container">
                        <Uploader
                            // methodInApp={this.methodInApp}
                            setImgUrl={this.setImgUrl}
                            toggleModal={this.toggleModal}
                            id={this.state.id}
                        />
                    </div>
                )}

                {/* NEW below  */}
                <Profile
                    toggleModal={this.toggleModal}
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    bio={this.state.bio}
                    updateBio={this.updateBio}
                    cancelBio={this.cancelBio}
                />
            </div>
        );
    }
}
