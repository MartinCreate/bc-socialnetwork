import React from "react";
import Present from "./present";
import Uploader from "./uploader";
import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.setImgUrl = this.setImgUrl.bind(this);
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
            <div>
                <h1>Hello from App</h1>
                <div
                    onClick={() => this.toggleModal()}
                    className="prof-pic-div"
                >
                    <Present
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        setImgUrl={this.setImgUrl}
                        id={this.state.id}
                    />
                )}
                <div>
                    <img src="./logo4.png" alt="amjam logo" id="logo" />
                    <a href="/logout">Logout</a>
                </div>
            </div>
        );
    }
}
