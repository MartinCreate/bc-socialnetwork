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
            <div className="register-form">
                {this.state.error && <div>Oops, smt went wrong!</div>}
                <h3>I am the Registration Component!</h3>
                <input
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>Register!</button>
            </div>
        );
    }
}
