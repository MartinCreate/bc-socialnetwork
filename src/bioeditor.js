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
        let updateBioInfo = { id: this.props.id, newBio: this.props.bio };
        console.log("updateBioInfo: ", updateBioInfo);

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

    cancelEdit() {
        this.props.cancelBio(this.state.originalBio);
    }

    render() {
        if (this.state.editingMode) {
            return (
                <>
                    <textarea
                        onChange={(e) => this.props.updateBio(e)}
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
                            this.cancelEdit();
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
                // <div id="bio-editor-inside">
                <>
                    <p
                        onClick={() => {
                            this.toggleMode();
                        }}
                    >
                        Add Bio
                    </p>
                </>
                // </div>
            );
        }

        // return (
        //     <div id="bio-editor">
        //         <h1>I am the BioEditor</h1>

        //         {!this.props.bio && (
        //             <p
        //                 onClick={() => {
        //                     this.toggleMode();
        //                 }}
        //             >
        //                 Add Bio
        //             </p>
        //         )}
        //         {this.props.bio && (
        //             <div>
        //                 {this.props.bio}
        //                 <p
        //                     onClick={() => {
        //                         this.toggleMode();
        //                     }}
        //                 >
        //                     Edit Bio
        //                 </p>
        //             </div>
        //         )}
        //         {this.state.editingMode && (
        //             <div>
        //                 <textarea defaultValue={this.props.bio} />
        //                 <p>Submit Bio</p>
        //             </div>
        //         )}
        //     </div>
        // );
    }
}
