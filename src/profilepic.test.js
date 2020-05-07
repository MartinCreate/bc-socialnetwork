// import React from "react";
// import ProfilePic from "./profilepic";
// import { render, fireEvent } from "@testing-library/react";

// // Test1 - image src
// // First test (if 'test' is not defined, don't worry about it, it's a linter error)
// test("renders img with src set to url", () => {
//     //'container' is gonna be the DOM that is created when the react testing library renders ProfilePic.
//     const { container } = render(<ProfilePic imageUrl="/whatever.jpg" />);
//     //to test things we inspect the DOM and make sure everything is there that we expect to be there
//     //inside of expect() we're writing vanilla javascript, where w "container" is used like "document"
//     expect(container.querySelector("img").getAttribute("src")).toBe(
//         "/whatever.jpg"
//     );
// });

// //to run test, in terminal: npm test

// //Test 2 - image src default
// test("renders img with src set to /default.jpg", () => {
//     const { container } = render(<ProfilePic />);

//     expect(container.querySelector("img").getAttribute("src")).toBe(
//         "default.png"
//     );
// });

// // //Test 3 - image alt
// test("renders first and last props in alt attribute", () => {
//     const { container } = render(<ProfilePic first="Banana" last="Pancakes" />);

//     expect(container.querySelector("img").getAttribute("alt")).toBe(
//         "Banana Pancakes's profile picture"
//     );
// });

// ////// Test 4 - checking onClick event (NOT WORK ATM)
// // test("toggleModal prop gets called when img is clicked", () => {
// //     //if all i want to know is "is this function called?" we don't need to pass jest.fn() anything
// //     const myMockToggleModal = jest.fn();

// //     const { container } = render(<ProfilePic onClick={myMockToggleModal} />);

// //     //how to toggle an event in our test. up top: import { fireEvent } from "@testing-library/react"
// //     fireEvent.click(container.getElementsByClassName("prof-pic-div")[0]);

// //     expect(myMockToggleModal.mock.calls.length).toBe(1);
// // });

// //Test 4 - onClick (ivana's example)
// test("toggleModal prop gets called when img is clicked", () => {
//     //if all i want to know is "is this function called?" we don't need to pass jest.fn() anything
//     const myMockOnClick = jest.fn();

//     const { container } = render(<ProfilePic onClick={myMockOnClick} />);

//     //how to toggle an event in our test. up top: import { fireEvent } from "@testing-library/react"
//     fireEvent.click(container.querySelector("img"));

//     expect(myMockOnClick.mock.calls.length).toBe(1);
// });
