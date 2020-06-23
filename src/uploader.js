import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        var self = this;

        //Closing with click outside of modal. (had to use "mousedown", because stopPropagation with "click" made X unclickable)
        document
            .getElementById("upload-container")
            .addEventListener("mousedown", function () {
                self.props.toggleModal();
            });
        document
            .getElementById("upload-modal-div")
            .addEventListener("mousedown", function (e) {
                e.stopPropagation();
            });
    }

    handleImgFile(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    async submitImage() {
        var self = this;
        var formData = new FormData();
        formData.append("user_id", this.props.id);
        formData.append("file", this.state.file);

        try {
            const { data } = await axios.post("/upload-profile", formData);
            self.props.setImgUrl(data.resp.image_url);
        } catch (e) {
            console.log("ERROR in uploader.js POST /upload-profile: ", e);
        }
    }

    chooseImgButton() {
        var self = this;
        /* idea for code below, from:
                https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
                */
        var input = document.getElementById("choose-image");
        var label = document.getElementById("choose-img-label");
        var labelVal = input.innerHTML;

        if (!self.chooseImgHasEvent) {
            input.addEventListener("change", function (e) {
                var fileName = "";
                fileName = e.target.value;

                if (fileName) {
                    //fileName has C:/fakepath/ at the beginning, so I slice it off here
                    fileName = fileName.slice(12);
                    label.innerHTML = fileName;
                } else {
                    label.innerHTML = labelVal;
                }
                self.chooseImgHasEvent = true;
            });
            console.log(
                "This should only show up once, for the first uploaded image of the session"
            );
        }
        //---- idea for code above is from tympanus.net article ---------- //
    }

    render() {
        return (
            <div id="upload-modal-div">
                <p onClick={() => this.props.toggleModal()} id="x-upload">
                    X
                </p>
                <h2 className="uploader-text">Upload Profile Picture</h2>

                <label
                    onClick={() => this.chooseImgButton()}
                    htmlFor="choose-image"
                    id="choose-img-label"
                >
                    Choose Image ...
                </label>
                <input
                    onChange={(e) => this.handleImgFile(e)}
                    type="file"
                    name="file"
                    id="choose-image"
                    accept="image/*"
                />
                <br />
                <button onClick={(e) => this.submitImage(e)} id="submit-image">
                    Submit Image
                </button>
            </div>
        );
    }
}
