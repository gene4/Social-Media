import BioEditor from "./BioEditor";
import { ProfilePic } from "./ProfilePic";
import { useState, useEffect } from "react";
import Uploader from "./Uploader";
import Wall from "./Wall";

export function Profile({ first, last, imgUrl, bio, setBio, setProfilePic }) {
    const [uploaderIsVisible, isUploaderIsVisible] = useState(false);

    function toggleUploader() {
        if (!uploaderIsVisible) {
            isUploaderIsVisible(true);
        } else {
            isUploaderIsVisible(false);
        }
    }

    return (
        <div className="profile">
            <div className="profile-area">
                <Wall />
                <div onClick={() => toggleUploader()}>
                    <ProfilePic
                        first={first}
                        last={last}
                        imgUrl={imgUrl}
                        width="350"
                        height="350"
                    />
                </div>
                <BioEditor
                    bio={bio}
                    setBio={setBio}
                    first={first}
                    last={last}
                />
            </div>
            {uploaderIsVisible && <Uploader setProfilePic={setProfilePic} />}
        </div>
    );
}
