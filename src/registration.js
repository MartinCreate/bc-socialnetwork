import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            //demoing error
            error: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("(this.state): ", this.state)
        );
    }

    submit() {
        console.log("this.state in submit(): ", this.state);
        axios.post("/register", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                console.log("Registration Success!");
                this.setState({
                    error: false,
                });

                location.replace("/");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            //onChange: "every time smt changes in the input field, run this function and pass it the event object
            //error-message logic: if both conditions are true, it will render the second condition (second codition is always truthy since it is a string, so it's basically saying "if this.state.error is truthy, render the div")
            <div className="register-form form">
                <h3>Sign Up</h3>

                <div className="input-field-div">
                    {/* <p className="input-label">First Name:</p> */}
                    <input
                        name="first"
                        placeholder="First Name"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>

                <div className="input-field-div">
                    {/* <p className="input-label">Last Name:</p> */}
                    <input
                        name="last"
                        placeholder="Last Name"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>

                <div className="input-field-div">
                    {/* <p className="input-label">Email:</p> */}
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>

                <div className="input-field-div">
                    {/* <p className="input-label">Password:</p> */}
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>

                {this.state.error && (
                    <div className="error-message">
                        Oops, something went wrong! <br /> Please fill out every
                        field
                    </div>
                )}
                <button onClick={() => this.submit()}>Register</button>
                {/* <div className="ex">Example</div> */}
            </div>
        );
    }
}
