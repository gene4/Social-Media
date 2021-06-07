import axios from "./axios";
import { Link } from "react-router-dom";
import React from "react";

export class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        // Setting some default state:
        this.state = {
            error: false,
            view: 1,
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

    handleEmailSumbit(event) {
        console.log("handleEmailSumbit", this.state);
        event.preventDefault();
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                console.log("data", data);
                if (data.success === false) {
                    this.setState({
                        error: true,
                    });
                    // Update the error in the stat here
                } else {
                    this.setState({
                        view: 2,
                    });
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

    codePasswordSubmit(event) {
        console.log("codePasswordSubmit", this.state);

        event.preventDefault();
        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                console.log("data", data);
                if (data.success === false) {
                    this.setState({
                        error: true,
                    });
                    // Update the error in the stat here
                } else {
                    this.setState({
                        view: 3,
                    });
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

    determineViewToRender() {
        // this method will determine which view should be rendered
        if (this.state.view === 1) {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <form onSubmit={(event) => this.handleEmailSumbit(event)}>
                        <input
                            name={"email"}
                            placeholder={"email"}
                            // required
                            type={"email"}
                            onChange={this.handleChange}
                        />
                        <button type={"submit"}>Submit</button>
                    </form>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div>
                    <h1>
                        view 2: two inputs (reset code& new pw), & one button
                    </h1>
                    <form onSubmit={(event) => this.codePasswordSubmit(event)}>
                        <input
                            name={"code"}
                            placeholder={"Your Code"}
                            onChange={this.handleChange}
                        />
                        <input
                            name={"password"}
                            placeholder={"password"}
                            // required
                            type={"password"}
                            onChange={this.handleChange}
                        />
                        <button type={"submit"}>Submit</button>
                    </form>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div>
                    <h1>You have successfully restarted your password! </h1>
                    <Link to="/login"> Click here to Login!</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.state.error && (
                    <p>Oupsi! Something went wrong, try again.</p>
                )}

                {this.determineViewToRender()}
            </div>
        );
    }
}
