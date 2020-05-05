import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        // console.log("this.props.id: ", this.props.id);
        // console.log("uploader mounted!");
    }

    //demo
    // methodInUploader() {
    //     //here, we're running the method that was passed to Uploaer from app.js
    //     this.props.methodInApp("whoa nelly!");
    // }

    handleImgFile(e) {
        console.log("handleImgFile is running! ");
        console.log("e.target.files[0]: ", e.target.files[0]);

        this.setState({
            file: e.target.files[0],
        });
    }

    submitImage() {
        var self = this;
        var formData = new FormData();
        formData.append("user_id", this.props.id);
        formData.append("file", this.state.file);

        axios
            .post("/upload-profile", formData)
            .then(function ({ data }) {
                self.props.setImgUrl(data.resp.image_url);
            })
            .catch(function (err) {
                console.log("ERROR in uploader.js POST /upload-profile: ", err);
                //find way to render error message
            });
    }

    render() {
        return (
            <div className="upload-modal">
                <h2 className="uploader-text">
                    This is my uploader component!!
                </h2>
                <h3 onClick={() => this.methodInUploader()}>
                    Click here to run methodInUploader
                </h3>

                {/* <label @click="chooseImgButton" for="choose-image" id='choose-img-label'>Choose an image ...</label> */}
                <input
                    onChange={(e) => this.handleImgFile(e)}
                    type="file"
                    name="file"
                    id="choose-image"
                    accept="image/*"
                />
                <button onClick={(e) => this.submitImage(e)}>
                    Submit Image
                </button>
            </div>
        );
    }
}
