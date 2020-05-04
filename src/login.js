import React from "react";
import axios from "./axios"; //the ./ means use the axios from the same directory that we're in (i.e. from the axios.js., which contains the csurf configuration)
// import { Link } is used wherever you use Link to render a component through a new url Path
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
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

    submit() {
        // console.log("this.state in submit(): ", this.state);
        axios.post("/login", this.state).then(({ data }) => {
            // console.log("data: ", data);
            if (data.success) {
                console.log("Login Success!");
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
            <div className="login-form form">
                <h3>Sign In</h3>
                <p className="toggle-comps">
                    or <Link to="/">Register</Link>
                </p>

                <div className="input-field-div">
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>

                <div className="input-field-div">
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="focus-border"></span>
                </div>
                <p className="toggle-comps">
                    Forgot Password?{" "}
                    <Link to="/reset" id="to-reset">
                        Reset
                    </Link>{" "}
                    Password
                </p>
                {this.state.error && (
                    <div className="error-message">
                        Oops, something went wrong! <br /> Please try again
                    </div>
                )}
                <button onClick={() => this.submit()}>Login</button>
            </div>
        );
    }
}
