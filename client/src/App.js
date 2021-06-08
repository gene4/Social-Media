import { Component } from "react";
import Logo from "./Logo";
import { ProfilePic } from "./ProfilePic";
import Uploader from "./Uploader";
import axios from "./axios";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
    }

    componentDidMount() {
        console.log("we mounting");
        axios.get("./user").then(({ data }) => {
            this.setState({
                userId: data[0].id,
                first: data[0].first,
                last: data[0].last,
                picUrl: data[0].url,
            });
        });
    }

    setProfilePic(imgUrl) {
        this.setState({
            picUrl: imgUrl,
        });
    }

    toggleUploader() {
        if (!this.state.uploaderIsVisible) {
            this.setState({
                uploaderIsVisible: true,
            });
        } else {
            this.setState({
                uploaderIsVisible: false,
            });
        }
    }

    render() {
        return (
            <div>
                <h3>
                    hiiii {this.state.userId} {this.state.first}{" "}
                    {this.state.last}
                </h3>

                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.picUrl}
                    toggleUploader={this.toggleUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader setProfilePic={this.setProfilePic} />
                )}
            </div>
        );
    }
}
