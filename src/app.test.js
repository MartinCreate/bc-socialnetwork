// import React from "react";
// import App from "./app";
// import { render, waitForElement } from "@testing-library/react";
// import axios from "./axios";

// //Test 1 - In-class example
// //automatic mock - have jest create a mock version of axios with mock versions of axios's requests
// jest.mock("./axios");

// //problem: we depend on the data we receive from real axios requests. (and we put that data in state). solution: pass mock values

// test("App shows nothing at first", async () => {
//     //pass the fake response data (that our state needs) to mockReslovedValue. the values of the properties don't matter
//     axios.get.mockResolvedValue({
//         data: {
//             id: 1,
//             first: "mortin",
//             last: "pual",
//             image_url: "dog.png",
//         },
//     });

//     const { container } = render(<App />);

//     //Dealing with async: use waitForElement to tell the test to wait for a specified element to appear in the DOM before running. (our mocked axios is still asynchronous)
//     //this accesses the first/main div that pops up
//     await waitForElement(() => container.querySelector("div"));

//     //Container is the DOM. the component only renders one element (with potentially smaller elements), therefore container.children.length is 1 if that one element is loaded.
//     expect(container.children.length).toBe(1);
// });
