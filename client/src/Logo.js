import { Component } from "react";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div>
                <img src="../favicon.ico" alt="icon" />
            </div>
        );
    }
}
