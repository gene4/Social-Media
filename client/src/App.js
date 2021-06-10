import { Component } from "react";
import Logo from "./Logo";
import { ProfilePic } from "./ProfilePic";
import Uploader from "./Uploader";
import axios from "./axios";
import { Profile } from "./Profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./OtherProfiles";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios.get("./user").then(({ data }) => {
            this.setState({
                userId: data[0].id,
                first: data[0].first,
                last: data[0].last,
                picUrl: data[0].url,
                bio: data[0].bio,
            });
        });
        console.log("picurl", this.state);
    }

    setProfilePic(imgUrl) {
        this.setState({
            picUrl: imgUrl,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
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
            <BrowserRouter>
                <div className="app">
                    <nav className="nav">
                        <Logo />
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.picUrl}
                            toggleUploader={this.toggleUploader}
                            width="50"
                            height="50"
                        />
                    </nav>

                    {this.state.uploaderIsVisible && (
                        <Uploader setProfilePic={this.setProfilePic} />
                    )}
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imgUrl={this.state.picUrl}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            />
                        )}
                    />
                    <Route path="/user/:id" component={OtherProfile} />
                </div>
            </BrowserRouter>
        );
    }
}
