import React from "react";
import Present from "./present";
import Uploader from "./uploader";
import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.setImgUrl = this.setImgUrl.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("componentDidMount data: ", data);
            this.setState({
                first: data.first,
                last: data.last,
                id: data.id,
                imageUrl: data.image_url,
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

    render() {
        //you pass information from parent to child through attributes in the child's html tag as seen in <Present/> below
        return (
            <div id="app-component">
                <div id="logo-div">
                    <img src="./logo4.png" alt="amjam logo" id="logo" />
                    <br />
                    <a href="/logout" id="logout">
                        Logout
                    </a>
                </div>
                <div onClick={() => this.toggleModal()} id="prof-pic-container">
                    <Present
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
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
            </div>
        );
    }
}
