import BioEditor from "./BioEditor";
import { ProfilePic } from "./ProfilePic";

export function Profile({ first, last, imgUrl, bio, setBio }) {
    return (
        <div className="profile">
            <ProfilePic
                first={first}
                last={last}
                imgUrl={imgUrl}
                width="350"
                height="350"
            />
            <div>
                <BioEditor
                    bio={bio}
                    setBio={setBio}
                    first={first}
                    last={last}
                />
            </div>
        </div>
    );
}
