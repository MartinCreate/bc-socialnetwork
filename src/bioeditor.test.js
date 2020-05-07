import React from "react";
import BioEditor from "./bioeditor";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import axios from "./axios";

//Test 1
test("renders 'Add Bio' button, if no bio is passed", async () => {
    const { container } = render(<BioEditor bio={null} />);

    await waitForElement(() => container.querySelector("p"));

    expect(container.getElementsByClassName("bio-button")[0].innerHTML).toBe(
        "Add Bio"
    );
});

//Test 2
test("renders 'Edit Bio' button, if a bio is passed to it", async () => {
    const { container } = render(<BioEditor bio="I'm just a poor boy" />);

    await waitForElement(() => container.querySelector("p"));

    expect(container.getElementsByClassName("bio-button")[0].innerHTML).toBe(
        "Edit Bio"
    );
});

//Test 3
test("clicking 'Add Bio' or 'Edit Bio, renders textarea and 'Submit Bio' button", () => {
    const myMockOnClick = jest.fn();

    const { container } = render(<BioEditor onClick={myMockOnClick} />);

    fireEvent.click(container.querySelector("p"));

    //"Submit bio" is the second element with classname "bio-button". The first element is the "Cancel" button
    expect(container.getElementsByClassName("bio-button")[1].innerHTML).toBe(
        "Submit Bio"
    );

    expect(container.getElementsByTagName("textarea").length).toBe(1);
});

// //Test 4
// jest.mock("./axios");

// test("clicking 'Submit Bio' causes an ajax request", async () => {
//     // axios.post.mockResolvedValue({
//     //     data: {
//     //         id: 1,
//     //         newBio: "It's a hardknock life",
//     //     },
//     // });

//     const { container } = render(<BioEditor bio={null} onClick={axios.post} />);

//     //render "Submit Bio" button
//     await fireEvent.click(container.querySelector("p"));
//     await waitForElement(() => container.getElementsByClassName("bio-button"));

//     //click "Submit bio"
//     await fireEvent.click(container.getElementsByClassName("bio-button")[1]);

//     expect(axios.post).toHaveBeenCalledTimes(1);
// });
