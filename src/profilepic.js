import React from "react";

//this.props allows us to access the properties and methods passed from the parent through the attributes given to the html tag that was used to call this component in the parent
//---(counts for class aswell. we don't need to pass props as an argument like we're doing here)
//we can destructure to avoid some repetitive props.whatever. whe just have to know what props we want in advance

export default function ProfilePic({
    toggleModal,
    first,
    last,
    imageUrl,
    // styles,
}) {
    imageUrl = imageUrl || "default.png"; //get a picture to use as your default and call it default.png or whatever the file extension is

    return (
        // <div onClick={() => toggleModal()} style={{...styles}} >
        <div onClick={() => toggleModal()} id="prof-pic-div">
            <img
                src={imageUrl}
                className="profile-pic"
                alt={`${first} ${last}'s profile picture`}
            />
        </div>
    );
}

// //non-destructured version of above code, below
// export default function ProfilePic(props) {
//     console.log("props in ProfilePic: ", props);

//     return (
//         <div>
//             <h2>
//                 I am a presentational component and my name is {props.first}{" "}
//                 {props.last}!
//             </h2>

//             <img src={props.imageUrl} alt="profile picture" />
//         </div>
//     );
// }
