import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

//props from app.js

export default function Profile({
    id,
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    updateBio,
}) {
    return (
        <div id="profile-component">
            <div id="pic-inProfile">
                <ProfilePic
                    toggleModal={toggleModal}
                    first={first}
                    last={last}
                    imageUrl={imageUrl}
                />
            </div>
            <div id="bio-div">
                <h1>
                    {first} {last}
                </h1>
                <h3>Profile</h3>
                <div id="bio-editor">
                    <BioEditor id={id} bio={bio} updateBio={updateBio} />
                </div>
            </div>
        </div>
    );
}
