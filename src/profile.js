import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor"; //this will have to be made by me

//everything that is passed from app.js to profilepic.js must be passed to profile.js aswell (which you can access here through props)
//we don't need ajax requests here

// export default function Profile({ toggleModal, first, last, imageUrl }) {
export default function Profile({
    id,
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    updateBio,
}) {
    // console.log("props: ", props);
    // console.log("props.first: ", props.first);
    console.log("id: ", id);
    console.log("bio: ", bio);

    //Reacty styling
    // const stylesProf = {
    //     propKey: "value",
    //     backgroundColor: "blue",
    // };

    return (
        <div>
            <p>Profile Component</p>
            <div id="pic-inProfile">
                <ProfilePic
                    toggleModal={toggleModal}
                    first={first}
                    last={last}
                    imageUrl={imageUrl}
                />
                {/* Reacty styling: Move the line below into <ProfilePic /> */}
                {/* styles={stylesProf} */}
            </div>
            {first} {last}
            <div id="bio-editor">
                <h1>I am the BioEditor</h1>
                <BioEditor id={id} bio={bio} updateBio={updateBio} />
            </div>
        </div>
    );
}
