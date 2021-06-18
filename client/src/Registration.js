import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export class Registration extends React.Component {
    constructor(props) {
        super(props);
        // Setting some default state:
        this.state = {
            error: false,
        };
        // Option 1 to keep track of the this context - binding:
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("CHANGE", event.target.name, event.target.value);
        this.setState(
            {
                [event.target.name]: event.target.value,
            },
            // I can check the state update in this callback:
            () => console.log("STATE", this.state)
        );
    }

    handleSubmit(event) {
        console.log("SUBMIT", this.state);

        event.preventDefault();
        axios
            .post("/register", this.state)
            .then(({ data }) => {
                console.log("data", data);
                if (data.success === false) {
                    this.setState({
                        error: true,
                    });
                    // Update the error in the stat here
                } else {
                    location.reload();
                    console.log("else");
                }
            })
            .catch((err) => {
                console.log("CATCH ERROR", err);
                // Update the erro in the state here.
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="register">
                {this.state.error && (
                    <p>Oupsi! Something went wrong, try again.</p>
                )}

                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <h1>Register</h1>
                    <input
                        name={"firstName"}
                        placeholder={"First Name"}
                        onChange={this.handleChange}
                    />
                    <input
                        name={"lastName"}
                        placeholder={"Last Name"}
                        onChange={this.handleChange}
                    />
                    <input
                        name={"email"}
                        placeholder={"email"}
                        type={"email"}
                        onChange={this.handleChange}
                    />
                    <input
                        name={"password"}
                        placeholder={"password"}
                        type={"password"}
                        onChange={this.handleChange}
                    />
                    <button type={"submit"}>Register</button>
                    <p className="member">
                        Already a member?! Click{" "}
                        <Link className="here" to="/login">
                            here
                        </Link>{" "}
                        to Login!
                    </p>
                </form>
                <div className="logo-entry">
                    <img
                        width="300"
                        height="300"
                        src="../iconfinder.png"
                        alt="icon"
                    />
                    <h1>Hot Track Summer!</h1>
                </div>
            </div>
        );
    }
}
