import React from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const userId = this.props.match.params.id;

        axios
            .get(`/user/${userId}.json`)
            .then(({ data }) => {
                if (data.ownProfile) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        userId: data[0].id,
                        first: data[0].first,
                        last: data[0].last,
                        picUrl: data[0].url || "../defaultUser.png",
                        bio: data[0].bio,
                    });
                }
            })
            .catch((e) => {
                console.log("cant find user", e);
            });
    }

    render() {
        return (
            <div className="profile">
                <section>
                    <img
                        height="350"
                        width="350"
                        src={this.state.picUrl}
                        alt={`Profile picture for ${this.state.first} ${this.state.last}`}
                    />
                    <FriendButton userId={this.props.match.params.id} />
                </section>
                <div className="bio">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    {this.state.bio && <p>{this.state.bio}</p>}
                    {!this.state.bio && <p>No bio yet!</p>}
                </div>
            </div>
        );
    }
}
