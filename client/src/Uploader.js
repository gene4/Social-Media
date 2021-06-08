import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };

        this.uploadPic = this.uploadPic.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    handleFileChange(e) {
        this.image = e.target.files[0];
    }

    uploadPic(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("file", this.image);
        axios
            .post("/upload", formData)
            .then(function (result) {
                console.log(result.data);
                this.props.setProfilePic(result.data.url);
            })
            .catch((err) => {
                console.log("ERROR upload pic", err);
                // Update the erro in the state here.
            });
    }

    render() {
        return (
            <div>
                <h3>Change your picture!</h3>
                <form onSubmit={(event) => this.uploadPic(event)}>
                    <input
                        name="file"
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={this.handleFileChange}
                    />
                    <button>Upload</button>
                </form>
            </div>
        );
    }
}
