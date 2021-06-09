import { Component } from "react";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className="logo">
                <img width="50" height="50" src="../favicon.ico" alt="icon" />
                <h1>Hot Track Summer!</h1>
            </div>
        );
    }
}
