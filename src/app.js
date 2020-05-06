import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";

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
            });
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
        console.log("draft: ", draft);
        this.setState({
            bio: draft,
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
                            setImgUrl={this.setImgUrl}
                            toggleModal={this.toggleModal}
                            id={this.state.id}
                        />
                    </div>
                )}

                <Profile
                    toggleModal={this.toggleModal}
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    bio={this.state.bio}
                    updateBio={this.updateBio}
                />
            </div>
        );
    }
}
