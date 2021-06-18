import { Component } from "react";
import { musicplayer } from "./musicPlayer";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {
            class: false,
        };
    }

    componentDidMount() {}
    toggleClass() {
        console.log("wiw");
        if (!this.state.class) {
            document.querySelector(".logo img").classList.add("flip");
            document.querySelector(".logo h1").classList.add("hot");
            musicplayer("play");
            this.setState({
                class: true,
            });
        } else {
            document.querySelector(".logo img").classList.remove("flip");
            document.querySelector(".logo h1").classList.remove("hot");
            musicplayer("pause");
            this.setState({
                class: false,
            });
        }
    }

    render() {
        return (
            <div className="logo">
                <img
                    onClick={() => this.toggleClass()}
                    width="50"
                    height="50"
                    src="../favicon.ico"
                    alt="icon"
                />
                <h1>Hot Track Summer!</h1>
            </div>
        );
    }
}
