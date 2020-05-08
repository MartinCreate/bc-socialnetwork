import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

// Test1 - image src
test("renders img with src set to url", () => {
    const { container } = render(<ProfilePic imageUrl="/whatever.jpg" />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/whatever.jpg"
    );
});

//Test 2 - image src default
test("renders img with src set to /default.jpg", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "default.png"
    );
});

//Test 3 - image alt
test("renders first and last props in alt attribute", () => {
    const { container } = render(<ProfilePic first="Banana" last="Pancakes" />);
    expect(container.querySelector("img").getAttribute("alt")).toBe(
        "Banana Pancakes's profile picture"
    );
});

//// Test 4 - checking onClick event
test("toggleModal prop gets called when img is clicked", () => {
    const myMockToggleModal = jest.fn();
    const { container } = render(
        <ProfilePic toggleModal={myMockToggleModal} />
    );
    fireEvent.click(container.querySelector("img"));

    expect(myMockToggleModal.mock.calls.length).toBe(1);
});
