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
                    <textarea
                        onChange={(e) => this.tempBio(e)}
                        defaultValue={this.props.bio}
                    />
                    <p
                        onClick={() => {
                            this.submitBio();
                            this.toggleMode();
                        }}
                    >
                        Submit Bio
                    </p>
                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                    >
                        Cancel
                    </p>
                </>
            );
        } else if (this.props.bio) {
            return (
                <>
                    <p>{this.props.bio}</p>

                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                    >
                        Edit Bio
                    </p>
                </>
            );
        } else {
            return (
                <>
                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                    >
                        Add Bio
                    </p>
                </>
            );
        }
    }
}
