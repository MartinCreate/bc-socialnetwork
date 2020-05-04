import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            step: 1, //this property has to be changed
        };
    }

    handleChange(e) {
        // console.log("e.target.value: ", e.target.value);
        // console.log("e.target.name: ", e.target.name);

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("(this.state): ", this.state)
        );
    }

    sendEmail() {
        axios.post("/reset-pword/one", this.state).then(({ data }) => {
            // console.log("data: ", data);
            if (data.success) {
                console.log("Code-send & storage Success!");
                this.setState({
                    error: false,
                    step: 2,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    resetPassword() {
        axios.post("/reset-pword/two", this.state).then(({ data }) => {
            // console.log("data: ", data);
            if (data.success) {
                console.log("reset Password Success!");
                this.setState({
                    error: false,
                    step: 3,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        //do conditional rendering here to render the different input fields
        //the logic in the {} expression below reads: "if this.state.step == 1, then render what comes after &&"
        return (
            <div>
                {this.state.step == 1 && (
                    <div className="reset-form form">
                        <h3>Reset Password</h3>

                        <p className="toggle-reg-log">
                            Back to <Link to="/login">Login</Link>
                        </p>

                        <div className="input-field-div">
                            <input
                                name="email"
                                placeholder="Email"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="focus-border"></span>
                        </div>

                        {this.state.error && (
                            <div className="error-message">
                                Oops, something went wrong! <br /> Please try
                                again
                            </div>
                        )}
                        <button onClick={() => this.sendEmail()}>
                            Send Reset Code
                        </button>
                    </div>
                )}

                {this.state.step == 2 && (
                    <div className="reset-form form">
                        <h3>Reset Password</h3>
                        <p className="form-desc">
                            In the fields below, enter the code that was sent to
                            your email as well as a new password of your choice.
                        </p>

                        <div className="input-field-div">
                            <input
                                name="code"
                                placeholder="Code"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="focus-border"></span>
                        </div>
                        <div className="input-field-div">
                            <input
                                name="newPassword"
                                placeholder="New Password"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="focus-border"></span>
                        </div>

                        {this.state.error && (
                            <div className="error-message">
                                Oops, something went wrong! <br /> Please try
                                again
                            </div>
                        )}
                        <button onClick={() => this.resetPassword()}>
                            Reset Password
                        </button>
                    </div>

                    // <div>
                    //     <input name="code" />
                    //     <input name="password" />
                    //     <button>Submit</button>
                    // </div>
                )}
                {this.state.step == 3 && (
                    <div className="reset-form form">
                        <h3>Reset Password</h3>
                        <p className="success">Success!</p>
                        <p className="form-desc">
                            Your password has been reset.
                            <br />
                            You can now <Link to="/login">login</Link> with your
                            new password.
                        </p>
                    </div>

                    // <div>
                    //     <input name="code" />
                    //     <input name="password" />
                    //     <button>Submit</button>
                    // </div>
                )}
            </div>
        );
    }
}
