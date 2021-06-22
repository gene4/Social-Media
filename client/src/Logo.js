import { Component } from "react";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {
            class: false,
            audio: new Audio(
                "../megan_thee_stallion_hot_girl_summer_ft_nicki_minaj_ty_dolla_ign.mp3"
            ),
        };
    }

    componentDidMount() {}

    toggleClass() {
        console.log("wiw");
        if (!this.state.class) {
            document.querySelector(".logo img").classList.add("flip");
            document.querySelector(".logo h1").classList.add("hot");
            this.state.audio.play();
            this.setState({
                class: true,
            });
        } else {
            document.querySelector(".logo img").classList.remove("flip");
            document.querySelector(".logo h1").classList.remove("hot");
            this.state.audio.pause();
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
