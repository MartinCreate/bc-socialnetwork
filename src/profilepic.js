import React from "react";

//props from apps.js and profile.js

export default function ProfilePic({ toggleModal, first, last, imageUrl }) {
    imageUrl = imageUrl || "/default.png";

    return (
        <div className="prof-pic-div">
            <img
                onClick={toggleModal}
                src={imageUrl}
                className="profile-pic"
                alt={`${first} ${last}'s profile picture`}
            />
        </div>
    );
}
