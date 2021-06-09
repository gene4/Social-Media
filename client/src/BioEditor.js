import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            draft: "",
        };
    }

    saveBio() {
        console.log("sending bio:", this.state.draft);
        axios
            .post("/bio", { bio: this.state.draft })
            .then(({ data }) => {
                console.log("we got bio", data);
                this.props.setBio(data.bio);
                this.setState({
                    editMode: false,
                });
            })
            .catch((err) => {
                console.log("ERROR upload bio", err);
                // Update the erro in the state here.
            });
    }
    render() {
        const { editMode } = this.state;
        const { bio } = this.props;
        const { first } = this.props;
        const { last } = this.props;
        return (
            <div className="bio">
                <h1>
                    {first} {last}
                </h1>
                {editMode && (
                    <div className="bioEditor">
                        <textarea
                            wrap="off"
                            onChange={(e) =>
                                this.setState({
                                    draft: e.target.value,
                                })
                            }
                            defaultValue={bio}
                        ></textarea>
                        <button onClick={() => this.saveBio()}>Save</button>
                    </div>
                )}

                {!editMode && bio && (
                    <div className="bioEditor">
                        <p>{bio}</p>
                        <button
                            onClick={() => {
                                this.setState({
                                    editMode: true,
                                });
                            }}
                        >
                            Edit
                        </button>
                    </div>
                )}

                {!editMode && !bio && (
                    <div className="bioEditor">
                        <button
                            onClick={() => {
                                this.setState({
                                    editMode: true,
                                });
                            }}
                        >
                            Add Bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
