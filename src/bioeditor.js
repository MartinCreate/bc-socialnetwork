import React from "react";
import Profile from "./profile";
import axios from "./axios";

// state: editingMode: true/false
//<textarea defaultValue={this.props.bio} />

export default class BioEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            editingMode: false,
        };
    }

    componentDidMount() {
        this.setState({
            originalBio: this.props.bio,
        });
    }

    toggleMode() {
        this.setState({
            editingMode: !this.state.editingMode,
        });
    }

    submitBio() {
        let updateBioInfo = { id: this.props.id, newBio: this.state.draftBio };
        this.props.updateBio(this.state.draftBio);

        axios
            .post("/update-bio", updateBioInfo)
            .then(function () {
                console.log("bioUpdate Success!");
            })
            .catch(function (err) {
                console.log("ERROR in bioeditor.js POST /update-bio: ", err);
                //find way to render error message
            });
    }

    tempBio(e) {
        console.log("draftBio in tempBio: ", this.state.draftBio);
        this.setState({
            draftBio: e.target.value,
        });
    }

    render() {
        if (this.state.editingMode) {
            return (
                <>
                    <div id="submit-and-cancel-bio">
                        <p
                            onClick={() => {
                                this.toggleMode();
                            }}
                            id="cancel"
                            className="bio-button"
                        >
                            Cancel
                        </p>
                        <p
                            onClick={() => {
                                this.submitBio();
                                this.toggleMode();
                            }}
                            id="submit-bio"
                            className="bio-button"
                        >
                            Submit Bio
                        </p>
                    </div>
                    <textarea
                        onChange={(e) => this.tempBio(e)}
                        defaultValue={this.props.bio}
                        id="bio-textarea"
                    />
                </>
            );
        } else if (this.props.bio) {
            return (
                <>
                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                        id="edit-bio"
                        className="bio-button"
                    >
                        Edit Bio
                    </p>
                    <p id="bio-text">{this.props.bio}</p>
                </>
            );
        } else {
            return (
                <>
                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                        className="bio-button"
                    >
                        Add Bio
                    </p>
                </>
            );
        }
    }
}
